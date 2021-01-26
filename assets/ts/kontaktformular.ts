/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/grecaptcha/index.d.ts" />

class Contact {
  private static isValidEmail(email: string): boolean {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  private static clearErrors(): void {
    $("#emailAlert").remove();
    $("#feedbackForm .help-block").hide();
    $("#feedbackForm .form-group").removeClass("has-error");
  }

  private static clearForm(): void {
    $("#feedbackForm input").val("");
    grecaptcha.reset();
  }

  private static addError($input: JQuery): void {
    const parentFormGroup = $input.parents(".form-group");
    parentFormGroup.children(".help-block").show();
    parentFormGroup.addClass("has-error");
  }

  private static addAjaxMessage(msg: string, isError: boolean): void {
    $("#feedbackSubmit").after("<div id='emailAlert' class='alert alert-"
                               + (isError ? "danger'" : "success'")
                               + " style='margin-top: 5px;'>"
                               + $("<div/>").text(msg).html()
                               + "</div>");
  }

  private static initialize(): void {
    $("[required]").closest(".form-group")
                   .find("label")
                   .append("<span class='text-warning'>*</span>");

    $("#feedbackSubmit").click((): boolean => {
      Contact.clearErrors();

      // do a little client-side validation -- check that each field has a value and e-mail field is in proper format
      // use bootstrap validator (https://github.com/1000hz/bootstrap-validator) if provided, otherwise a bit of custom
      // validation
      const $form = $("#feedbackForm");
      let hasErrors = false;

      if (($form as any).validator) {
        hasErrors = ($form as any).validator("validate").hasErrors;
      } else {
        $("#feedbackForm input").not(".optional").each((i, e): void => {
          const $this = $(e);
          if (($this.is(":checkbox") && !$this.is(":checked")) || !$this.val()) {
            hasErrors = true;
            Contact.addError($(e));
          }
        });

        const $email = $("#email");

        if (!Contact.isValidEmail($email.val().toString())) {
          hasErrors = true;
          Contact.addError($email);
        }
      }

      // if there are any errors return without sending e-mail
      if (hasErrors) {
        return false;
      }

      // send the feedback e-mail
      $.ajax({
        data: $form.serialize(),
        error: (response: JQueryXHR): void => {
          Contact.addAjaxMessage(response.responseJSON.message, true);
        },
        success: (data: any): void => {
          Contact.addAjaxMessage(data.message, false);
          Contact.clearForm();
        },
        type: "POST",
        url: "/php/sendmail.php"
      });

      return false;
    });
  }

  constructor() {
    Contact.initialize();
  }
}

$(() => new Contact());
