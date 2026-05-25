<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['Phone'] ?? '';
    $date = $_POST['Dates'] ?? '';
    $message = $_POST['Poruka'] ?? '';
    $guests = $_POST['Broj-gostiju'] ?? '';
    $country = $_POST['Zemlja'] ?? '';
    $arrival_time = $_POST['Ocekivani-dolazak'] ?? '';
    $apartments = '';

    if (isset($_POST['deluxe-apartman'])) {
        $apartments .= 'Deluxe Apartman, ';
    }
    if (isset($_POST['trosoban-apartman'])) {
        $apartments .= 'Trosoban apartman, ';
    }
    if (isset($_POST['dvosoban-apartman'])) {
        $apartments .= 'Dvosoban apartman, ';
    }
    if (isset($_POST['kikin-apartman'])) {
        $apartments .= 'Dvosoban apartman sa dnevnim boravkom, ';
    }

    $apartments = rtrim($apartments, ', ');

    $to = "apartmanielegance@gmail.com";
    $subject = "New Reservation Form Submission";
    $headers = "apartmanielegance@gmail.com" . "\r\n" .
        "Reply-To: $email" . "\r\n" .
        'X-Mailer: PHP/' . phpversion();

    $email_body = "Name: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Phone: $phone\n";
    $email_body .= "Dates: $date\n";
    $email_body .= "Guests: $guests\n";
    $email_body .= "Country: $country\n";
    $email_body .= "Arrival Time: $arrival_time\n";
    $email_body .= "Selected Apartments: $apartments\n";
    $email_body .= "Message:\n$message\n";

    if (mail($to, $subject, $email_body, $headers)) {
        echo "Email Successfully Sent!";
    } else {
        echo "Failed to send the email!";
    }
}
?>
