---
  title: Kontakt
  description: Ideen, Wünsche, Kritik oder Anregungen? Nehmen Sie Kontakt auf mit dem Musikverein Wollbach.
  keywords: Kontakt, Kontaktformular
  menu: footer
  CustomExternalJs:
    - https://www.google.com/recaptcha/api.js
---

<div id="contact_form" class="row">
  <form id="feedbackForm" role="form" data-toggle="validator" data-disable="false">
    <div class="form-group">
      <label class="control-label" for="name">Name</label>
      <div class="input-group">
        <input id="name" class="form-control" type="text" name="name" placeholder="Ihr Name" required />
        <span class="input-group-addon"></span>
      </div>
      <span class="help-block" style="display: none;">Bitte geben Sie Ihren Namen an.</span>
    </div>
    <div class="form-group">
      <label class="control-label" for="email">e-Mail Adresse</label>
      <div class="input-group">
        <input id="email" class="form-control" type="email" name="email" placeholder="Ihre e-Mail Adresse" required />
        <span class="input-group-addon"></span>
      </div>
      <span class="help-block" style="display: none;">Bitte geben Sie eine gültige e-Mail Adresse für evtl. Rückfragen an.</span>
    </div>
    <div class="form-group">
      <label class="control-label" for="message">Nachricht</label>
      <div class="input-group">
        <input id="message" class="form-control" type="text" name="message" placeholder="Ihre Nachricht" required />
        <span class="input-group-addon"></span>
      </div>
    </div>
    <div class="form-group has-feedback">
      <div class="g-recaptcha" data-sitekey="6LeUkp8UAAAAAAe3vQ6fI_qCvn7rDb91MDwNYOLC"></div>
      <span class="help-block" style="display: none;">Bitte bestätigen Sie, dass Sie kein Bot sind.</span>
    </div>
    <span class="help-block" style="display: none;">Bitte geben Sie einen Sicherheitscode ein.</span>
    <button id="feedbackSubmit" type="submit" data-loading-text="Sende..." style="display: block; margin-top: 10px;">Absenden</button>
  </form>
</div>
