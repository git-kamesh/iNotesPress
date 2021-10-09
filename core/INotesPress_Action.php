<?php

/**
 * INotesPress_Action acts as an wrapper for Wordpress Action API
 * 
 * @since 1.0.0
 */
class INotesPress_Action {

    /**
     * Adds wordpress action
     * 
     * @since 1.0.0
     */
    public static function add($name, $func, $priority = 10, $accepted_args = 1) {
        return add_action($name, $func, $priority, $accepted_args);
    }
}