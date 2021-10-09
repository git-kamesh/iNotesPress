<?php

/**
 * INotesPress_Helper provides herlper apis
 * 
 * @since 1.0.0
 */
class INotesPress_Helper {

    /**
     * Returns user avatar url
     * 
     * @since 1.0.0
     */
    public static function get_avatar_url($user_id_or_email, $size = 30) {
        return get_avatar_url($user_id_or_email, array('size'=> $size));
    }


    /**
     * Return user data
     * 
     * @since 1.0.0
     */
    public static function get_userdata( $user_id ) {
        return get_userdata( $user_id );
    }
}