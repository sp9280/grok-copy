<?php
function calculateBMI($weight, $height) {
    if ($height <= 0 || $weight <= 0) {
        return "Invalid input";
    }
    $bmi = $weight / (($height / 100) * ($height / 100));
    return round($bmi, 2);
}

function getBMICategory($bmi) {
    if ($bmi < 18.5) {
        return "Underweight";
    } elseif ($bmi < 25) {
        return "Normal weight";
    } elseif ($bmi < 30) {
        return "Overweight";
    } else {
        return "Obese";
    }
}
?>
