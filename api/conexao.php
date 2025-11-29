<?php
$servidor = "sql207.infinityfree.com"; 
$usuario  = "seu_usuario_do_banco"; 
$senha    = "sua_senha_do_banco";
$banco    = "nome_do_banco";

$con = new mysqli($servidor, $usuario, $senha, $banco);

if ($con->connect_error) {
    die("Erro na conexão: " . $con->connect_error);
}
?>