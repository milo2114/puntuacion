<?php

require_once "conexion.php";


class ModeloUsuarios{

    static public function mdlIngresarUsuario($documento){
        $stmt = Conexion::conectar()->prepare("SELECT * FROM usuarios WHERE documento_id = :documento");
        $stmt->bindParam(":documento", $documento, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch();
    }


} // fin de la clase ModeloUsuarios