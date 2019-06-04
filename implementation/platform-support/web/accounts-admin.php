<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
include('config.php');
//from https://stackoverflow.com/questions/13640109/how-to-prevent-browser-cache-for-php-site
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
// from https://stackoverflow.com/questions/14467673/enable-cors-in-htaccess
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // should do a check here to match $_SERVER['HTTP_ORIGIN'] to a
    // whitelist of safe domains
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

}
function getParam($name) {
    if (isset($_GET[$name])) {
        return $_GET[$name];
    } else {
        if (isset($_POST[$name])) {
            return $_POST[$name];
        }
        else
        {
            return '';
        }
    }
}
include('active.fracturedb.php');
function eiteHashSecret($secretkey) {
    return password_hash($secretkey, PASSWORD_DEFAULT);
}
$database=new FractureDB($mysqlTablePrefix.'eite_node', $mysqlUser, $mysqlPassword, $mysqlServer);
echo '<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style type="text/css" media="all">table,tr,td{border:1px dotted maroon;}"</style>
<title>User Access Management</title>
</head>
<body><a href="/">→ Home</a><br><br>
<table><thead><tr></tr></thead>
<tbody>';
$resultsArray=$database->getTable('idxPerson');
$counter = 0;
while ($counter <= (count($resultsArray) - 1)) {
    $userRow=$resultsArray[$counter];
    $columnarray = explode(',', $columns);
    global $baggage_claim;
    $temp_temp_table = $baggage_claim->claim_luggage('temp_temp_table');
    $tableid = $baggage_claim->claim_luggage('tableid');
    $table = $baggage_claim->claim_luggage('table');
    //print_r($temp_temp_table);
    echo '   var ' . $table . '_' . $columnarray[$counter] . '_' . $temp_temp_table["$tableid"] . ' = document.getElementById(\'' . $table . '_' . $columnarray[$counter] . '_' . $temp_temp_table["$tableid"] . '\').innerHTML;

';
    $counter++;
}
echo '</tbody></table></body></html>';