<?php
/*
Plugin Name: Genesis Subtitles
Plugin URI: http://ahjira.com/plugins/genesis-subtitles
Description: Genesis HTML5 Child Themes Only. Adds an entry field for subtitles to post/page edit screens. Inserts subtitle after post/page title on posts/pages.
Version: 1.3
Author: Suzanne Ahjira
Author URI: http://ahjira.com
License: GPL2

*/

add_action( 'edit_form_after_title', 'ahjira_insert_subtitle_field' );
add_action( 'save_post', 'ahjira_subtitle_save', 10, 2 );
add_filter( 'genesis_entry_header', 'ahjira_subtitle_after_title', 11 );

function ahjira_insert_subtitle_field() { 

  global $post;
  
  $value = get_post_meta( $post->ID, '_ahjira_subtitle', TRUE );
  
  $subtitle = isset( $value ) ? esc_textarea( $value ) : "";  
  
  wp_nonce_field( basename( __FILE__ ), 'ahjira_subtitle_nonce' );

  ?>

  <label><?php echo __( 'Subtitle', 'ahjira_subtitle' ); ?></label>
  <textarea name="ahjira_subtitle" id="ahjira_subtitle" style="-moz-box-sizing: border-box;-webkit-box-sizing: border-box;-ms-box-sizing: border-box;box-sizing: border-box;width: 100%;border-radius: 3px;border:1px solid #dfdfdf;padding: 3px 8px;font-size: 20px;line-height: 1.3em;height: 60px;outline: 0;margin: 0 0 20px;"><?php echo $subtitle; ?></textarea>
  
  <?php
}

function ahjira_subtitle_save( $post_id, $post ) {
  
  if ( !isset( $_POST['ahjira_subtitle_nonce'] ) || !wp_verify_nonce( $_POST['ahjira_subtitle_nonce'], basename( __FILE__ ) ) )
    return $post_id;

  if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
    return $post_id;

  $new_meta_value = ( isset( $_POST['ahjira_subtitle'] ) ? $_POST['ahjira_subtitle'] : '' );
  
	$meta_value = get_post_meta( $post_id, '_ahjira_subtitle', true );

	if ( $new_meta_value && '' == $meta_value )
		add_post_meta( $post_id, '_ahjira_subtitle', $new_meta_value, true );

	elseif ( $new_meta_value && $new_meta_value != $meta_value )
		update_post_meta( $post_id, '_ahjira_subtitle', $new_meta_value );

	elseif ( '' == $new_meta_value && $meta_value )
		delete_post_meta( $post_id, '_ahjira_subtitle', $meta_value );

}

function ahjira_subtitle_after_title( $output ) {

  global $post;
  
  $subtitle = esc_html( get_post_meta( $post->ID, '_ahjira_subtitle', TRUE ) );
  
  if( !empty( $subtitle ) ) {

    $output = apply_filters( 'genesis_subtitles_output', sprintf( '<h2 class="subtitle">%s</h2>', $subtitle ) );

    echo $output;

  }

}

