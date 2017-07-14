module MVW.StillFeelingGood {
  function isValidEmail (email: string): boolean {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  function clearErrors (): void {
    $("#emailAlert").remove();
    $("#feedbackForm .help-block").hide();
    $("#feedbackForm .form-group").removeClass("has-error");
  }

  function clearForm (): void {
    $("#feedbackForm input").val("");
    grecaptcha.reset();
  }

  function addError($input: JQuery): void {
    let parentFormGroup = $input.parents(".form-group");
    parentFormGroup.children(".help-block").show();
    parentFormGroup.addClass("has-error");
  }

  function addAjaxMessage (msg: string, isError: boolean): void {
    $("#feedbackSubmit").after("<div id='emailAlert' class='alert alert-"
                               + (isError ? "danger'" : "success'")
                               + " style='margin-top: 5px;'>"
                               + $("<div/>").text(msg).html()
                               + "</div>");
  }

  export function initialize(): void {
    $("[required]").closest(".form-group")
                   .find("label")
                   .append("<span class='text-warning'>*</span>");

    $("#feedbackSubmit").click(() => {
      clearErrors();

      // do a little client-side validation -- check that each field has a value and e-mail field is in proper format
      // use bootstrap validator (https://github.com/1000hz/bootstrap-validator) if provided, otherwise a bit of custom
      // validation
      let $form = $("#feedbackForm");
      let hasErrors = false;

      if ((<any> $form).validator) {
        hasErrors = (<any> $form).validator("validate").hasErrors;
      } else {
        $("#feedbackForm input").not(".optional").each((i: number, e: HTMLElement) => {
          let $this = $(e);
          if (($this.is(":checkbox") && !$this.is(":checked")) || !$this.val()) {
            hasErrors = true;
            addError($(e));
          }
        });

        let $email = $("#email");

        if (!isValidEmail($email.val().toString())) {
          hasErrors = true;
          addError($email);
        }
      }

      // if there are any errors return without sending e-mail
      if (hasErrors) {
        return false;
      }

      // send the feedback e-mail
      $.ajax({
        data: $form.serialize(),
        error: function (response: JQueryXHR): void {
          addAjaxMessage(response.responseJSON.message, true);
        },
        success: function (data: any): void {
          addAjaxMessage(data.message, false);
          clearForm();
        },
        type: "POST",
        url: "/php/sendmail.php?isCD=true"
      });

      return false;
    });
  }
}

$(() => { MVW.StillFeelingGood.initialize(); });
