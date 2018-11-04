var gp4Loading = false;

jQuery('#gp4_pay_credit').on('click', function(e) {
    e.preventDefault();
    // フォームの内容を追加
    jQuery('#gp4_pay_select_howtopay').attr('style', 'display:none;');
    jQuery('#gp4-pay-form').html(
        jQuery('#gp4-pay-form').html +
        '<p class="gp4_cardnumber_row"><label class="gp4_cardnumber_row__label">カード番号：</label><input type="text" id="gp4-c-number" name="c_number" class="gp4_cardnumber_row__input"></p>' +
        '<p class="gp4_exp_row"><label class="gp4_exp_row__label">有効期限：</label><input type="text" id="gp4-exp-year" name="exp_year" class="gp4_exp_row__input--year"><span> / </span><input type="text" id="gp4-exp-month" name="exp_month" class="gp4_exp_row__input--month"></p>' +
        '<p class="gp4_cvc_row"><label class="gp4_cvc_row__label">セキュリティキー：</label><input type="text" id="gp4-cvc" name="cvc" class="gp4_cvc_row__input"></p>' +
        '<p class="gp4_name_row"><label class="gp4_name_row__label">カード名義人：</label><input type="text" id="gp4-name" name="name" class="gp4_name_row__input"></p>' +
        '<p class="gp4_amount_row"><label class="gp4_amount_row__label">料金：</label><input type="text" id="gp4-amount" name="amount" class="gp4_amount_row__input"></p>' +
        '<input type="submit" id="gp4-form-button" value="送信" class="btn gp4_submit">'
    );

    jQuery('#gp4-form-button').on('click', function(e) {
        e.preventDefault();
    
        console.log('start confirm');
    
        // フォームの非表示と結果表示
        jQuery('#gp4-pay-form').attr('style', 'display:none;');
        jQuery('#gp4-pay-result').html(
            '<div class="gp4_pay_confirm">' +
                '<div id="loading"><img class="gp4_ajax_loader" src="loader.gif" style="display:none;"></div>' +
                '<div id="main-contents">' +
                    '<dl>' +
                        '<dt>カード番号：</dt>' +
                        '<dd>' + jQuery('#gp4-pay-form [name=c_number]').val() + '</dd>' +
                        '<dt>有効期限：</dt>' +
                        '<dd>' + jQuery('#gp4-pay-form [name=exp_year]').val() + '/' + jQuery('#gp4-pay-form [name=exp_month]').val() + '</dd>' +
                        '<dt>セキュリティチェックコード</dt>' +
                        '<dd>●●●</dd>' +
                        '<dt>カード保有者名</dt>' +
                        '<dd>' + jQuery('#gp4-pay-form [name=name]').val() + '</dd>' +
                        '<dt>支払い料金</dt>' +
                        '<dd>' + jQuery('#gp4-pay-form [name=amount]').val() + '円</dd>' +
                    '</dl>' +
                    '<input type="submit" id="gp4-pay-modify" value="修正する" class="btn gp4_submit">' +
                    '<span>&nbsp;</span>' +
                    '<input type="submit" id="gp4-pay-confirm" value="確定する" class="btn gp4_submit">' +
                '</div>' +
            '</div>'
        );
    
        jQuery('#gp4-pay-modify').on('click', function (e) {
            e.preventDefault();
    
            console.log('start modify');
    
            // 修正ボタン押下時は、結果画面を削除してフォームに戻る
            jQuery('#gp4-pay-form').attr('style', 'display:block;');
            jQuery('.gp4_pay_confirm').remove();
        });
    
        jQuery('#gp4-pay-confirm').on('click', function (e) {
            e.preventDefault();
    
            // 確定ボタン押下時は、ローダーを有効にしてボタンを無効化
            jQuery('.gp4_ajax_loader').attr('style', 'display:block');
            jQuery('input').attr('disabled', 'disabled');
    
            console.log('start ajax');
            var data = {
                'user_id': jQuery('#gp4-pay-form [name=user_id]').val(),
                'test_mode': jQuery('#gp4-pay-form [name=test_mode]').val(),
                'c_number': jQuery('#gp4-pay-form [name=c_number]').val(),
                'exp_year': jQuery('#gp4-pay-form [name=exp_year]').val(),
                'exp_month': jQuery('#gp4-pay-form [name=exp_month]').val(),
                'cvc': jQuery('#gp4-pay-form [name=cvc]').val(),
                'name': jQuery('#gp4-pay-form [name=name]').val(),
                'amount': jQuery('#gp4-pay-form [name=amount]').val()
            };
            jQuery.ajax({
                'type': 'POST',
                'url': '/wp-json/gpay/1/pay',
                'contentType': 'application/json',
                'data': JSON.stringify(data)
            }).done( function( response, textStatus, jqXHR ) {
                // 送金完了画面
                jQuery('#gp4-pay-form').remove();
                jQuery('.gp4_pay_confirm').remove();
                jQuery('#gp4-pay-result').html(
                    '<div class="gp4_pay_success">送金が完了しました。</div>'
                );
    
    
            }).fail( function( jqXHR, textStatus, errorThrown ) {
                // 一旦アラート出す
                alert('問題が発生しました！\n' + jqXHR);
                console.log(jqXHR);
                jQuery('input').attr('disabled', 'null');
            }).always( function( data_or_jqXHR, textStatus, jqXHR_or_errorThrown ) {
                gp4Loading = false;
            });
        });
    });
});

jQuery('#gp4_pay_depositment').on('click', function(e) {
    e.preventDefault();

    // フォームの内容を追加
    jQuery('#gp4_pay_select_howtopay').attr('style', 'display:none;');
    jQuery('#gp4-pay-form').html(
        jQuery('#gp4-pay-form').html +
        '<p class="gp4_email"><label class="gp4_email__label">メールアドレス：</label><input type="text" id="gp4-email" name="email" class="gp4_email__input"></p>' +
        '<input type="submit" id="gp4-form-button" value="送信" class="btn gp4_submit" required>'
    );
    jQuery('#gp4-form-button').on('click', function(e) {
        e.preventDefault();

        // TODO Validationをつける！required効かない場合。

        jQuery('#gp4-pay-form').attr('style', 'display:none;');
        var data = {
            'user_id': jQuery('#gp4-pay-form [name=user_id]').val(),
            'test_mode': jQuery('#gp4-pay-form [name=test_mode]').val(),
            'email': jQuery('#gp4-pay-form [name=email]').val()
        };

        jQuery.ajax({
            'type': 'POST',
            'url': '/wp-json/gpay/1/pay',
            'contentType': 'application/json',
            'data': JSON.stringify(data)
        }).done( function( response, textStatus, jqXHR ) {
            // 送金完了画面
            jQuery('#gp4-pay-form').remove();
            jQuery('.gp4_pay_confirm').remove();
            jQuery('#gp4-pay-result').html(
                '<div class="gp4_pay_success">ご入力いただいたメールアドレスに振込情報を送信いたします。<br />'+
                'メールの到着まで5分程度お待ちください。<br /><br />' + 
                'もし、メールアドレスが間違っていた場合、メールが届かないため、再度入力してください。</div>'
            );
        }).fail( function( jqXHR, textStatus, errorThrown ) {
            // 一旦アラート出す
            alert('問題が発生しました！\n' + jqXHR);
            console.log(jqXHR);
            jQuery('input').attr('disabled', 'null');
        }).always( function( data_or_jqXHR, textStatus, jqXHR_or_errorThrown ) {
            gp4Loading = false;
        });
    });
});
