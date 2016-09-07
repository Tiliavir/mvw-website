module MVW.StillFeelingGood {
  function isValidEmail (email: string) {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  function clearErrors () {
    $("#emailAlert").remove();
    $("#feedbackForm .help-block").hide();
    $("#feedbackForm .form-group").removeClass("has-error");
  }

  function clearForm () {
    $("#feedbackForm input").val("");
    grecaptcha.reset();
  }

  function addError($input: JQuery) {
    let parentFormGroup = $input.parents(".form-group");
    parentFormGroup.children(".help-block").show();
    parentFormGroup.addClass("has-error");
  }

  function addAjaxMessage (msg: string, isError: boolean) {
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

    $("#feedbackSubmit").click(function () {
      let $btn = $(this);
      $btn.html("Sende ...");
      clearErrors();

      // do a little client-side validation -- check that each field has a value and e-mail field is in proper format
      // use bootstrap validator (https://github.com/1000hz/bootstrap-validator) if provided, otherwise a bit of custom
      // validation
      let $form = $("#feedbackForm");
      let hasErrors = false;

      if ((<any>$form).validator) {
        hasErrors = (<any>$form).validator("validate").hasErrors;
      } else {
        $("#feedbackForm input").not(".optional").each(function () {
          let $this = $(this);
          if (($this.is(":checkbox") && !$this.is(":checked")) || !$this.val()) {
            hasErrors = true;
            addError($(this));
          }
        });

        let $email = $("#email");

        if (!isValidEmail($email.val())) {
          hasErrors = true;
          addError($email);
        }
      }

      // if there are any errors return without sending e-mail
      if (hasErrors) {
        $btn.html("Zurücksetzen");
        return false;
      }

      // send the feedback e-mail
      $.ajax({
        complete: function () {
          $btn.html("Zurücksetzen");
        },
        data: $form.serialize(),
        error: function (response) {
          addAjaxMessage(response.responseJSON.message, true);
        },
        success: function (data) {
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
