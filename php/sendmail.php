<?php
  function errorResponse ($messsage) {
    header('HTTP/1.1 500 Internal Server Error');
    die(json_encode(array('message' => $messsage)));
  }

  function constructMessageBody () {
    $fields_req =  array("name" => true, "email" => true, "message"=> true);
    $message_body = "";
    foreach ($fields_req as $name => $required) {
      $postedValue = $_POST[$name];
      if ($required && empty($postedValue)) {
        errorResponse("$name is empty.");
      } else {
        $message_body .= ucfirst($name) . ":  " . $postedValue . "\n";
      }
    }
    return $message_body;
  }

  function constructCDMessageBody () {
    $fields_req = array("name" => true, "email" => true, "quantity"=>true, "message"=> true);
    $message_body = "";
    foreach ($fields_req as $name => $required) {
      $postedValue = $_POST[$name];
      if ($required && empty($postedValue)) {
        errorResponse("$name is empty.");
      } else {
        $message_body .= ucfirst($name) . ":  " . $postedValue . "\n";
      }
    }

    $body = array();
    $body[] = "\r\n\r\nVorbereitete Antwort:\r\n";
    $body[] = "Sehr geehrte/r ";
    $body[] = $_POST['name'];
    $body[] = "\r\nvielen Dank für Ihre Bestellung!\r\n";
    $body[] = "Bitte überweisen Sie nachstehenden Betrag auf unser Konto:\r\n\r\n";
    $body[] = 15 * $_POST['quantity'];
    $body[] = "€ zzgl. Versand: __€\r\nVerwendungszweck:";
    $body[] = $_POST['quantity'];
    $body[] = " CD";
    $body[] = $_POST['quantity'] > 1 ? "s" : '';
    $body[] = ", ";
    $body[] = $_POST['name'];
    $body[] = "\r\n\r\nZugunsten:\r\n";
    $body[] = "Förderverein Blasmusik\r\n";
    $body[] = "DE07 6835 0048 1004 1066 11\r\n";
    $body[] = "BIC SKLODE66";

    return $message_body.implode($body);
  }

  header('Content-type: application/json');

  $isCD = $_GET["isCD"];

  require_once '../../files/private.php';
  
  $data = array(
          'secret' => $RECAPTCHA_SECRET_KEY,
          'response' => $_POST["g-recaptcha-response"]
      );

  $verify = curl_init();
  curl_setopt($verify, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
  curl_setopt($verify, CURLOPT_POST, true);
  curl_setopt($verify, CURLOPT_POSTFIELDS, http_build_query($data));
  curl_setopt($verify, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($verify, CURLOPT_RETURNTRANSFER, true);
  $result = json_decode(curl_exec($verify));
  
  if (!$result->success) {
    errorResponse('Das hat leider nicht geklappt. Bitte erneut versuchen.');
  }

  // attempt to send email
  $to      = 'kontakt@mv-wollbach.de';

  if($isCD) {
    $subject = 'CD Bestellung [Musikverein Wollbach]';
    $message = constructCDMessageBody();
  } else {
    $subject = 'Kontakt [Musikverein Wollbach]';
    $message = constructMessageBody();
  }

  $message = wordwrap($message, 70, "\r\n", true);

  $headers = array();
  $headers[] = "MIME-Version: 1.0";
  $headers[] = "Content-type: text/plain; charset=utf-8";
  $headers[] = "From: Musikverein Kontakt <info@mv-wollbach.de>";
  $headers[] = "Reply-To: Musikverein Wollbach <info@mv-wollbach.de>";
  $headers[] = "Subject: {$subject}";
  $headers[] = "X-Mailer: PHP/".phpversion();

  if(mail($to, $subject, $message, implode("\r\n", $headers))) {
    echo json_encode(array('message' => 'Erfolgreich versandt.'));
  } else {
    errorResponse('Fehler beim Versenden der Anfrage. Bitte wenden Sie sich an info@mv-wollbach.de');
  }
?>
