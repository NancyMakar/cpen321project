package com.example.findyourpeers;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ViewOtherProfile extends AppCompatActivity {

    private TextView otherDisplayNameTV, otherCoopTV, otherYearTV;
    private String otherdisplayname, otheryearstanding, othercoopstatus;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_other_profile);

        Intent intentProfileOther = getIntent();
        String userID = intentProfileOther.getExtras().getString("userID");

        otherDisplayNameTV = findViewById(R.id.other_display_name);
        otherCoopTV = findViewById(R.id.other_coop_status);
        otherYearTV = findViewById(R.id.other_year_standing);

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String urlOther = "http://10.0.2.2:3010/getuserprofile/"+userID;

        // Initialize a new JsonArrayRequest instance
        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, urlOther,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        // Do something with response
                        //mTextView.setText(response.toString());

                        // Process the JSON
                        try{
                            // Get current json object
                            JSONObject student = response.getJSONObject(0);

                            // Get the current student (json object) data
                            otherdisplayname = student.getString("displayName");
                            othercoopstatus = student.getString("coopStatus");
                            otheryearstanding = student.getString("yearStanding");

                            // Display the formatted json data in text view
                            otherDisplayNameTV.setText(otherdisplayname);

                            if(othercoopstatus.equals("Yes")){
                                otherCoopTV.setText("I am in Co-op");
                            }else{
                                otherCoopTV.setText("I am not in Co-op, studying only");
                            }
                            otherYearTV.setText("I am in year " + otheryearstanding);


                        }catch (JSONException e){
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener(){
                    @Override
                    public void onErrorResponse(VolleyError error){
                        // Do something when error occurred
                        Toast.makeText(ViewOtherProfile.this, "Something went wrong in getting data", Toast.LENGTH_SHORT).show();
                    }
                }
        );

        // Add JsonArrayRequest to the RequestQueue
        requestQueue.add(jsonArrayRequest);



    }
}