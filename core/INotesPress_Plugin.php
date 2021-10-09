<?php

/**
 * INotesPress_Plugin acts as an wrapper for Wordpress Plugin API
 * 
 * @since 1.0.0
 */
class INotesPress_Plugin {

    /**
     * Callback is executed when plugin is activated
     * 
     * @since 1.0.0
     */
    public static function activated($file, $callback) {
        return register_activation_hook($file, $callback);
    }

    /**
     * Callback is executed when plugin is deactivated
     * 
     * @since 1.0.0
     */
    public static function deactivated($file, $callback) {
        return register_deactivation_hook($file, $callback);
    }

    /**
     * Callback is executed when plugin is uninstalled
     * 
     * @since 1.0.0
     */
    public static function uninstalled($file, $callback) {
        return register_uninstall_hook($file, $callback);
    }
}