<?php

$data = array('name' => 'Vibhaj Rajan',  'time' => date('c'));
$arr = array('valid' => (time()%2 ==0), 'msg' => 'Sorry Time not an Even Number', 'data' => array($data, $data));
												
echo json_encode($arr);

?>