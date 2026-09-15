<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost:4306"; 
$user = "root";
$pass = "";
$db   = "pizza-db"; 

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die(json_encode(["error" => "فشل الاتصال"]));
$conn->set_charset("utf8mb4");

$response = ["pizzas" => [], "offers" => [], "about" => "Welcome to Pizza Area!"];

$res_p = $conn->query("SELECT * FROM products");
if ($res_p) {
    while($row = $res_p->fetch_assoc()) {
        $response["pizzas"][] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "category" => $row['category'],
            "prices" => ["S" => $row['price_s'], "M" => $row['price_m'], "L" => $row['price_l']],
            "image" => $row['image'],
            "ingredients" => $row['Ingredients']
        ];
    }
}
if ($conn->query("SHOW TABLES LIKE 'offers'")->num_rows > 0) {
    $res_o = $conn->query("SELECT * FROM offers");
    while($row = $res_o->fetch_assoc()) $response["offers"][] = $row;
}

$check_o = $conn->query("SHOW TABLES LIKE 'offers'");
if ($check_o->num_rows > 0) {
    $res_o = $conn->query("SELECT * FROM offers");
    while($row = $res_o->fetch_assoc()) $response["offers"][] = $row;
}

$check_a = $conn->query("SHOW TABLES LIKE 'about_info'");
if ($check_a->num_rows > 0) {
    $res_a = $conn->query("SELECT content FROM about_info LIMIT 1");
    if($row = $res_a->fetch_assoc()) $response["about"] = $row['content'];
}

echo json_encode($response);
$conn->close();

?>