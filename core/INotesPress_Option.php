<?php

/**
 * INotesPress_Option acts as an wrapper for Wordpress Option API
 * 
 * @since 1.0.0
 */
class INotesPress_Option {

    /**
     * Adds an option
     * 
     * @since 1.0.0
     */
    public static function add( $option, $value, $deprecated = false, $autoload = 'yes' ) {
        return add_option( $option, $value, $deprecated, $autoload );
    }

    /**
     * Returns an option value
     * 
     * @since 1.0.0
     */
    public static function get( $option, $default = false ) {
        return get_option( $option, $default );
    }

    /**
     * Updates an option value
     * 
     * @since 1.0.0
     * 
     * @param string $option option name
     * @param 
     */
    public static function update( $option, $newvalue ) {
        return update_option( $option, $newvalue );
    }

    /**
     * Deletes an option value
     * 
     * @since 1.0.0
     */
    public static function delete( $option ) {
        return delete_option( $option );
    }
}