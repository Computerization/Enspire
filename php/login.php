<?php
    $_POST = json_decode(file_get_contents("php://input"),true);
    echo {status:"ok"};
?>