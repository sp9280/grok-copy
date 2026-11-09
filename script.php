<?php
include 'utils/helpers.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $height = $_POST['height'];
    $weight = $_POST['weight'];

    if (is_numeric($height) && is_numeric($weight) && $height > 0 && $weight > 0) {
        $bmi = calculateBMI($weight, $height);
        $category = getBMICategory($bmi);
        echo "Your BMI is: " . $bmi . " (" . $category . ")";
    } else {
        echo "Please enter valid height and weight.";
    }
}
?>
