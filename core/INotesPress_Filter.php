<?php

/**
 * INotesPress_Filter acts as an wrapper for Wordpress Filter API
 * 
 * @since 1.0.0
 */
class INotesPress_Filter {

    /**
     * Adds wordpress filter
     * 
     * @since 1.0.0
     */
    public static function add($name, $func, $priority = 10, $accepted_args = 1) {
        return add_filter($name, $func, $priority, $accepted_args);
    }
}