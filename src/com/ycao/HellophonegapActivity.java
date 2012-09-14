package com.ycao;


import android.os.Bundle;
import com.phonegap.*;
public class HellophonegapActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
       
    	
        super.onCreate(savedInstanceState);
       // this.appView.setBackgroundColor(0);
       // this.appView.setBackgroundResource(R.drawable.logo);
        super.setIntegerProperty("splashscreen",R.drawable.bg2);
        super.loadUrl("file:///android_asset/www/index.html",1500);
      
    }
}