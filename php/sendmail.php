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

  header('Content-type: application/json');

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
  $subject = 'Kontakt [Musikverein Wollbach]';
  $message = constructMessageBody();
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
