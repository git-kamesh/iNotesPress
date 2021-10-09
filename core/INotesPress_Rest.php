<?php

/**
 * INotesPress_Rest acts as an wrapper for Wordpress REST API
 * 
 * @since 1.0.0
 */
class INotesPress_Rest {

    /**
     * Adds rest end-point
     * 
     * @since 1.0.0
     */
    public static function add($namespace, $type = 'GET', $endpoint, $handler, $permission_callback = null) {

        if(is_null($permission_callback)) {
            $permission_callback = function() {
                return true;
            };
        }

        return register_rest_route(
            $namespace,
            $endpoint,
            array(
                'methods' => $type,
                'callback' => $handler,
                'permission_callback'=> $permission_callback
            )
        );
    }
}