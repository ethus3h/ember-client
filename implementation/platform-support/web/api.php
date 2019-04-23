<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
// from https://stackoverflow.com/questions/14467673/enable-cors-in-htaccess
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // should do a check here to match $_SERVER['HTTP_ORIGIN'] to a
    // whitelist of safe domains
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
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
if (isset($_GET['table'])) {
    $table = $_GET['table'];
} else {
    $table = $_POST['table'];
}
if (isset($_GET['user'])) {
    $user = $_GET['user'];
} else {
    $user = $_POST['user'];
}
if (isset($_GET['secretkey'])) {
    $secretkey = $_GET['secretkey'];
} else {
    $secretkey = $_POST['secretkey'];
}
if (isset($_GET['action'])) {
    $action = $_GET['action'];
} else {
    $action = $_POST['action'];
}
if (isset($_GET['data'])) {
    $data = $_GET['data'];
} else {
    $data = $_POST['data'];
}
include('active.fracturedb.php');
$database=new FractureDB('futuqiur_eite_'.$table, $user, $secretkey);

if ($action==='getTable') {
    $resultsArray=$database->getTable($table);
    #print_r($resultsArray);
} elseif ($action==='getRowByValue') {
    $resultsArray=$database->getRow($table, $field, $value);
    
}
echo json_encode ($resultsArray);
?>
