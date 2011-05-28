<?php

$arr = array('success' => 'true',  
					'msg' => array(
						'module' => 'alert',
						'args' => array(
							'title' => "Success", 
							'data' =>"You're now logged in")
						)
					);
					
echo json_encode($arr);

?>
