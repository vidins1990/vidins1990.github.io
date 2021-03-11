<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
<?php 
    if(isset($_POST['new_file']) && $_POST['new_file']=="yes"){
        $myfile = fopen("test.html", "w") or die("Unable to open file!");
        $txt = $_POST['htmlcode'];
        fwrite($myfile, $txt);        
        fclose($myfile);
    }        
?>
<script type="text/javascript">location.href = 'test.html';</script>
</body>
</html>