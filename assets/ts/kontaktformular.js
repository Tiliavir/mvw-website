"use strict";
var Contact = (function () {
    function Contact() {
        Contact.initialize();
    }
    Contact.isValidEmail = function (email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    };
    Contact.clearErrors = function () {
        $("#emailAlert").remove();
        $("#feedbackForm .help-block").hide();
        $("#feedbackForm .form-group").removeClass("has-error");
    };
    Contact.clearForm = function () {
        $("#feedbackForm input").val("");
        grecaptcha.reset();
    };
    Contact.addError = function ($input) {
        var parentFormGroup = $input.parents(".form-group");
        parentFormGroup.children(".help-block").show();
        parentFormGroup.addClass("has-error");
    };
    Contact.addAjaxMessage = function (msg, isError) {
        $("#feedbackSubmit").after("<div id='emailAlert' class='alert alert-"
            + (isError ? "danger'" : "success'")
            + " style='margin-top: 5px;'>"
            + $("<div/>").text(msg).html()
            + "</div>");
    };
    Contact.initialize = function () {
        $("[required]").closest(".form-group")
            .find("label")
            .append("<span class='text-warning'>*</span>");
        $("#feedbackSubmit").click(function () {
            Contact.clearErrors();
            var $form = $("#feedbackForm");
            var hasErrors = false;
            if ($form.validator) {
                hasErrors = $form.validator("validate").hasErrors;
            }
            else {
                $("#feedbackForm input").not(".optional").each(function (i, e) {
                    var $this = $(e);
                    if (($this.is(":checkbox") && !$this.is(":checked")) || !$this.val()) {
                        hasErrors = true;
                        Contact.addError($(e));
                    }
                });
                var $email = $("#email");
                if (!Contact.isValidEmail($email.val().toString())) {
                    hasErrors = true;
                    Contact.addError($email);
                }
            }
            if (hasErrors) {
                return false;
            }
            $.ajax({
                data: $form.serialize(),
                error: function (response) {
                    Contact.addAjaxMessage(response.responseJSON.message, true);
                },
                success: function (data) {
                    Contact.addAjaxMessage(data.message, false);
                    Contact.clearForm();
                },
                type: "POST",
                url: "/php/sendmail.php"
            });
            return false;
        });
    };
    return Contact;
}());
$(function () { return new Contact(); });
