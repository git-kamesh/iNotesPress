<?php
defined('ABSPATH') || exit;

class INotesPress_Hooks {

    /** Plugin activated hook */
    public static function pluginActivate() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        
        $table_dfn = $wpdb->prefix.'inotespress';
        
        if ($wpdb->get_var("show tables like '$table_dfn'") != $table_dfn) {
            $sql = 'CREATE TABLE '.$table_dfn.' (
            `id` INT(11) NOT NULL AUTO_INCREMENT,
            `note` TINYTEXT NOT NULL,
            `parent_id` INT(11) NOT NULL DEFAULT 0,
            `parent_type` VARCHAR(20) NOT NULL DEFAULT \'\',
            `note_type` VARCHAR(20) NOT NULL DEFAULT \'text\',
            `created_by` INT(11) NULL DEFAULT 0,
            `modified_at` DATETIME NOT NULL DEFAULT \'0000-00-00 00:00:00\',
            PRIMARY KEY (id),
            UNIQUE KEY `id` (id)) ' . 'ENGINE = InnoDB '.$charset_collate.';';
            require_once ABSPATH.'wp-admin/includes/upgrade.php';
            dbDelta($sql);
        }
    }

    /** Plugin deactivate hook */
    public static function pluginDeactivate() {}
}
