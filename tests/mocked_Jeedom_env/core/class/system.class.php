<?php

require_once ('../../mocked_core.php');

class system
{
    public static $cmdSudo = 'exit && ';

    public static function getCmdSudo()
    {
        MockedActions::add(array('action' => 'get_cmd_sudo'));
        return self::$cmdSudo;
    }
}
