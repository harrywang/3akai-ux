/*
 * Licensed to the Sakai Foundation (SF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The SF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
/*global $, sdata, QueryString */

var sakai = sakai || {};

sakai.profilewow = function(){


    /////////////////////////////
    // CONFIGURATION VARIABLES //
    /////////////////////////////

    /*
     * This is a structure which UI would expect to get through /system/me
     * A subset of these would be stored in JCR the rest would be calculated on the fly
     * "value" and keys would be stored in JCR
     * "access": Would not be stored in JCR, but calculated and dumped on the fly according to the ACLs on the node
     * "source": Would not be stored in JCR, but calculated and dumped on the fly. This would tell wether the the source of data is external (LDAP for example) or internal (JCR)
     * "editable": Would not be stored in JCR, but calculated and dumped on the fly. Tells whether an element is editable or not in an external data source
     * some keys would be entirely generated on the fly, taking into account locale settings: "displayname" for example, where a full name could be generated by concatenation of first and last name but according to locale settings
     */
    var profile_data = {

        "basic": {
            "access": "public",
            "elements": {
                "firstname": {
                    "value": "Christian",
                    "source": "external",
                    "editable": false,
                    "access": "public"
                },
                "lastname": {
                    "value": "Vuerings",
                    "source": "external",
                    "editable": false,
                    "changeurl": "http://university.org/raven",
                    "access": "public"
                },
                "displayname": {
                    "value": "Christian Vuerings",
                    "source": "external",
                    "editable": false,
                    "access": "public"
                },
                "preferredname": {
                    "value": "denbuzze",
                    "source": "local",
                    "editable": true,
                    "access": "contacts"
                },
                "role": {
                    "value": "Student",
                    "source": "local",
                    "editable": true,
                    "access": "public"
                }
            }
        },
        "aboutme": {
            "access": "institution",
            "elements": {
                "aboutme": {
                    "value": "",
                    "source": "local",
                    "editable": true,
                    "access": "institution"
                },
                "academicinterests": {
                    "value": "",
                    "source": "local",
                    "editable": true,
                    "access": "institution"
                },
                "personalinterests": {
                    "value": "",
                    "source": "local",
                    "editable": true,
                    "access": "institution"
                },
                "hobbies": {
                    "value": "",
                    "source": "local",
                    "editable": true,
                    "access": "institution"
                }
            }
        },
        "publications": {
            "access": "public",
            "elements": [{
                "title": "Measuring quantum gravity on two legged mice",
                "authors": ["Jack Moorhen", "Nancy Fruit", "Ivan Behmetov"],
                "year": 1968,
                "url": "www.publications.org/pub_209438029384.pdf",
                "source": "local",
                "editable": true,
                "access": "contacts"
            }, {
                "title": "Measuring quantum gravity on 3 legged feral pigeons",
                "authors": ["Jack Moorhen", "Nancy Fruit"],
                "year": 1972,
                "url": "www.publications.org/pub_2983479283749.pdf",
                "source": "local",
                "editable": true,
                "access": "public"
            }]
        }
    };

    /*
     * This is a collection of profile config functions and settings
     * The structure of the config object is identical to the storage object
     * When system/me returns profile data for the logged in user the profile_config and profile_data objects could be merged
     * "label": the internationalisable message for the entry label in HTML
     * "required": Whether the entry is compulsory or not
     */
    var profile_config = {

        "basic": {
            "label": "__MSG__PROFILE_BASIC_LABEL__",
            "required": true,
            "display": true,
            "elements": {
                "firstname": {
                    "label": "__MSG__PROFILE_BASIC_FIRSTNAME_LABEL__",
                    "required": true,
                    "display": true,
                    "validation": function(input_value){
                        // Custom validation code here
                        if (typeof input_value === "string") {
                            return true;
                        }
                        else {
                            return "__MSG___PROFILE_BASIC_FIRSTNAME_ERROR_STRING__";
                        }
                    }
                },
                "lastname": {
                    "label": "__MSG__PROFILE_BASIC_LASTNAME_LABEL__",
                    "required": true,
                    "display": true
                },
                "displayname": {
                    "label": "__MSG__PROFILE_BASIC_DISPLAYNAME_LABEL__",
                    "required": true,
                    "display": true
                },
                "preferredname": {
                    "label": "__MSG__PROFILE_BASIC_PREFERREDNAME_LABEL__",
                    "required": false,
                    "display": true
                },
                "role": {
                    "label": "__MSG__PROFILE_BASIC_ROLE_LABEL__",
                    "required": true,
                    "display": true
                }
            }
        },
        "aboutme": {
            "label": "__MSG__PROFILE_ABOUTME_LABEL__",
            "required": true,
            "display": true,
            "elements": {
                "aboutme": {
                    "label": "__MSG__PROFILE_ABOUTME_LABEL__",
                    "required": false,
                    "display": true,
                    "example": "__MSG__PROFILE_ABOUTME_ABOUTME_EXAMPLE__",
                    "template": "profilewow_field_textarea_template"
                },
                "academicinterests": {
                    "label": "__MSG__PROFILE_ABOUTME_ACADEMICINTERESTS_LABEL__",
                    "required": false,
                    "display": true,
                    "example": "__MSG__PROFILE_ABOUTME_ACADEMICINTERESTS_EXAMPLE__"
                },
                "personalinterests": {
                    "label": "__MSG__PROFILE_ABOUTME_PERSONALINTERESTS_LABEL__",
                    "required": false,
                    "display": true,
                    "example": "__MSG__PROFILE_ABOUTME_PERSONALINTERESTS_EXAMPLE__"
                },
                "hobbies": {
                    "label": "__MSG__PROFILE_ABOUTME_HOBBIES_LABEL__",
                    "required": false,
                    "display": true,
                    "example": "__MSG__PROFILE_ABOUTME_HOBBIES_EXAMPLE__"
                }
            }
        },
        "publications": {
            "label": "__MSG__PROFILE_PUBLICATIONS_LABEL__",
            "required": false,
            "display": true,
            //"template": "profilewow_section_publications_template",
            "elements": {
                "title": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_TITLE__",
                    "required": false,
                    "display": true,
                    "example": "__MSG__PROFILE_PUBLICATIONS_TITLE_EXAMPLE__"
                },
                "authors": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_AUTHORS__",
                    "required": false,
                    "display": true,
                    "example": "__MSG__PROFILE_PUBLICATIONS_AUTHORS_EXAMPLE__"
                }
            }
        }
    };

    sakai.profilewow.profile = {
        chatstatus: "",
        config: profile_config,
        data: profile_data,
        isme: false,
        mode: {
            options: ["viewmy", "view", "viewas", "edit"],
            value: "viewmy"
        },
        acls: {
            options: ["public", "institution", "contacts", "noone"],
            value: "public"
        },
        picture: "",
        status: ""
    };

    var querystring; // Variable that will contain the querystring object of the page
    var userinfo_dummy_status; // Contains the dummy status for a user


    ///////////////////
    // CSS SELECTORS //
    ///////////////////

    var profilewow_class = ".profilewow";
    var $profilewow_field_default_template = $("#profilewow_field_default_template", profilewow_class);
    var $profilewow_footer = $("#profilewow_footer", profilewow_class);
    var $profilewow_footer_button_back;
    var $profilewow_footer_button_dontupdate;
    var $profilewow_footer_button_edit;
    var $profilewow_footer_template = $("#profilewow_footer_template", profilewow_class);
    var $profilewow_generalinfo = $("#profilewow_generalinfo", profilewow_class);
    var $profilewow_generalinfo_template = $("#profilewow_generalinfo_template", profilewow_class);
    var profilewow_generalinfo_template_container = "";
    var $profilewow_heading = $("#profilewow_heading", profilewow_class);
    var $profilewow_heading_template = $("#profilewow_heading_template", profilewow_class);
    var $profilewow_section_default_template = $("#profilewow_section_default_template", profilewow_class);
    var $profilewow_userinfo = $("#profilewow_userinfo", profilewow_class);
    var $profilewow_userinfo_status;
    var $profilewow_userinfo_status_input;
    var profilewow_userinfo_status_input_dummy = "profilewow_userinfo_status_input_dummy";
    var $profilewow_userinfo_status_input_dummy;
    var $profilewow_userinfo_template = $("#profilewow_userinfo_template", profilewow_class);


    ////////////////////
    // UTIL FUNCTIONS //
    ////////////////////

    /**
     * Change the mode of the current profile
     * @param {String} mode The mode for the profile (view | viewas | viewmy | edit)
     */
    var setProfileMode = function(mode){

        // Check the mode parameter
        if ($.inArray(mode, sakai.profilewow.profile.mode.options) !== -1) {

            // Set the correct profile mode
            sakai.profilewow.profile.mode.value = mode;

        }
        else {

            // Use the standard profile mode
            sakai.profilewow.profile.mode.value = sakai.profilewow.profile.mode.options[0];

            // Print a log message that the supplied mode isn't valid
            fluid.log("Profilewow - changeProfileMode - the supplied mode '" + mode + "' is not a valid profile mode. Using the default mode instead");

        }

    };

    /**
     * Get the profile mode from the querystring
     */
    var getProfileMode = function(){

        if (querystring.contains("mode")) {
            return querystring.get("mode");
        }
        return false;

    };

    /**
     * Change the profile mode
     * This will fire a redirect
     * @param {String} mode The mode you want to change to
     */
    var changeProfileMode = function(mode){

         // Check the mode parameter
        if ($.inArray(mode, sakai.profilewow.profile.mode.options) !== -1) {

            // Perform the redirect
            window.location = window.location.pathname + "?mode=" + mode;

        }

    };


    /**
     * Check whether the user is editing/looking at it's own profile or not
     * We do this because if it is the current user, we don't need to perform an extra search
     */
    var setIsMe = function(){

        // Check whether there is a user parameter in the querystring,
        // if so, check whether the userid is not the same as the user parameter
        if (querystring.contains("user") && querystring.get("user") !== sakai.data.me.user.userid) {
            sakai.profilewow.profile.isme = false;
        }
        else {
            sakai.profilewow.profile.isme = true;
        }

    };

    /**
     * Check whether there is a valid picture for the user
     * @param {Object} profile The profile object that could contain the profile picture
     * @return {String}
     * The complete URL of the profile picture
     * Will be an empty string if there is no picture
     */
    var constructProfilePicture = function(profile){

        if (profile.picture && profile.path) {
            return "/_user" + profile.path + "/public/profile/" + $.parseJSON(profile.picture).name;
        }
        else {
            return "";
        }

    };

    /**
     * Set the profile data for the user such as the status and profile picture
     */
    var setProfileData = function(callback){

        // Check whether the user is looking/editing it's own profile
        if (sakai.profilewow.profile.isme) {

            // Set the profile picture for the user you are looking at
            // /_user/a/ad/admin/public/profile/256x256_profilepicture
            sakai.profilewow.profile.picture = constructProfilePicture(sakai.data.me.profile);

            // Set the status for the user you want the information from
            if(sakai.data.me.profile.basic){
                sakai.profilewow.profile.status = $.parseJSON(sakai.data.me.profile.basic).status;
            }

            // Execute the callback function
            if (callback && typeof callback === "function") {
                callback();
            }

        }
        else {

            // We need to fire an Ajax GET request to get the profile data for the user
            $.ajax({
                data: {
                    "username": querystring.get("user")
                },
                url: sakai.config.URL.SEARCH_USERS,
                success: function(data){

                    // Set the profile picture
                    sakai.profilewow.profile.picture = constructProfilePicture(data.results[0]);

                    // Set the status for the user you want the information from
                    if(sakai.data.me.profile.basic){
                        sakai.profilewow.profile.status = $.parseJSON(sakai.data.me.profile.basic).status;
                    }

                },
                error: function(){
                    fluid.log("setProfilePicture: Could not find the user");
                },
                complete: function(data){

                    // Execute the callback function
                    if (callback && typeof callback === "function") {
                        callback();
                    }

                }
            });

        }

    };


    ///////////////////////
    // BINDING FUNCTIONS //
    ///////////////////////

    /**
     * Add binding to the user information section
     */
    var addBindingUserInfo = function(){

        // We need to reinitialise the jQuery objects after the rendering
        $profilewow_userinfo_status = $("#profilewow_userinfo_status", profilewow_class);
        $profilewow_userinfo_status_input = $("#profilewow_userinfo_status_input", profilewow_class);
        $profilewow_userinfo_status_input_dummy = $("#profilewow_userinfo_status_input_dummy", profilewow_class);

        // Add the focus event to the userinfo status
        $profilewow_userinfo_status_input.bind("focus", function(){

            // Check whether the status field has the dummy class
            if ($profilewow_userinfo_status_input.hasClass(profilewow_userinfo_status_input_dummy)) {

                // If we don't have the dummy status (e.g. What are you doing) variable set yet, set it now.
                if (!userinfo_dummy_status) {
                    userinfo_dummy_status = $profilewow_userinfo_status_input.val();
                }

                // Clear the current value for the input box and remove the dummy class
                $profilewow_userinfo_status_input.val("");
                $profilewow_userinfo_status_input.removeClass(profilewow_userinfo_status_input_dummy);
            }
            else {

                // If we don't have the dummy status (e.g. What are you doing) variable set yet, set it now.
                if (!userinfo_dummy_status) {
                    userinfo_dummy_status = $profilewow_userinfo_status_input_dummy.text();
                }
            }
        });

        // Add the blur event to the userinfo status
        $profilewow_userinfo_status_input.bind("blur", function(){

            // Check if it still has a dummy
            if (!$profilewow_userinfo_status_input.hasClass(profilewow_userinfo_status_input_dummy) && $.trim($profilewow_userinfo_status_input.val()) === "") {

                // Add the dummy class
                $profilewow_userinfo_status_input.addClass(profilewow_userinfo_status_input_dummy);

                // Set the input value to the dummy status (e.g. What are you doing)
                $profilewow_userinfo_status_input.val(userinfo_dummy_status);

            }
        });

        // Add the submit event to the status form
        $profilewow_userinfo_status.bind("submit", function(){

            $("button", $profilewow_userinfo_status).hide();
            $("img", $profilewow_userinfo_status).show();

            var inputValue = $profilewow_userinfo_status_input.hasClass(profilewow_userinfo_status_input_dummy) ? "" : $.trim($profilewow_userinfo_status_input.val());

            $.ajax({
                url: sakai.data.me.profile["jcr:path"],
                data: {
                    "_charset_": "utf-8",
                    "basic": $.toJSON({
                        "status": inputValue
                    })
                },
                type: "POST",
                success: function(){
                    $("img", $profilewow_userinfo_status).hide();
                    $("button", $profilewow_userinfo_status).show();
                },
                error: function(){

                }
            });

        });

    };

    /**
     * Add binding to the footer elements
     */
    var addBindingFooter = function(){

        // Reinitialise jQuery objects
        $profilewow_footer_button_back = $("#profilewow_footer_button_back", profilewow_class);
        $profilewow_footer_button_dontupdate = $("#profilewow_footer_button_dontupdate", profilewow_class);
        $profilewow_footer_button_edit = $("#profilewow_footer_button_edit", profilewow_class);

        // Bind the back button
        $profilewow_footer_button_back.bind("click", function(){

            // Go to the previous page
            history.go(-1);

        });

        // Bind the don't update
        $profilewow_footer_button_dontupdate.bind("click", function(){

            // Change the profile mode
            changeProfileMode("viewmy");

        });

        // Bind the edit button
        $profilewow_footer_button_edit.bind("click", function(){

            // Change the profile mode
            changeProfileMode("edit");

        });

    };

    /**
     * Add binding to all the elements on the page
     */
    var addBinding = function(){

        // Add binding to the user info
        addBindingUserInfo();

        // Add binding to footer elements
        addBindingFooter();

    };


    ////////////////////////
    // TEMPLATE FUNCTIONS //
    ////////////////////////

    /**
     * Render the profilewow site heading
     */
    var renderTemplateSiteHeading = function(){

        // Render the profilewow site heading
        $.TemplateRenderer($profilewow_heading_template, sakai.profilewow.profile, $profilewow_heading);

    };

    /**
     * Render the user information (such as picture / name / chat status)
     */
    var renderTemplateUserInfo = function(){

        // Render the user info
        $.TemplateRenderer($profilewow_userinfo_template, sakai.profilewow.profile, $profilewow_userinfo);

    };

    /**
     * Render the template for the field
     * @param {Object} fieldTemplate
     * @param {Object} sectionName
     * @param {Object} fieldObject
     * @param {Object} fieldName
     */
    var renderTemplateField = function(fieldTemplate, sectionName, fieldObject, fieldName){

        var json_config = {
            "data": sakai.profilewow.profile.data[sectionName].elements[fieldName],
            "config": sakai.profilewow.profile.config[sectionName].elements[fieldName]
        };

        return $.TemplateRenderer(fieldTemplate, json_config);

    };

    /**
     * Render the template for the sectino
     * @param {Object} sectionTemplate jQuery object that contains the template you want to render for the section
     * @param {Object} sectionObject The object you need to pass into the template
     * @param {String} sectionName The name of the sectionObject (e.g. basic)
     */
    var renderTemplateSection = function(sectionTemplate, sectionObject, sectionName){

        var sections = "";

        for(var i in sectionObject.elements){
            if(sectionObject.elements.hasOwnProperty(i)){

                // Set the field template, if there is no template defined, use the default one
                var fieldTemplate = sectionObject.elements[i].template ? $("#" + sectionObject.elements[i].template, profilewow_class) : $profilewow_field_default_template;

                // Render the template field
                sections += renderTemplateField(fieldTemplate, sectionName, sectionObject.elements[i], i);

            }
        }

        var json_config = {
            "data" : sakai.profilewow.profile.data[sectionName],
            "config" : sakai.profilewow.profile.config[sectionName],
            "fields" : $.trim(sections)
        };

        return $.TemplateRenderer(sectionTemplate, json_config);

    };

    /**
     * Render the general information (firstname/lastname/about me/...)
     */
    var renderTemplateGeneralInfo = function(){

        var generalinfo = "";

        for(var i in sakai.profilewow.profile.config){
            if(sakai.profilewow.profile.config.hasOwnProperty(i)){

                // Set the section template, if there is no template defined, user the default one
                var sectionTemplate = sakai.profilewow.profile.config[i].template ? $("#" + sakai.profilewow.profile.config[i].template, profilewow_class) : $profilewow_section_default_template;

                // Render the template section
                generalinfo += renderTemplateSection(sectionTemplate, sakai.profilewow.profile.config[i], i);

            }
        }

        // Render the General info
        $profilewow_generalinfo.html(sakai.api.i18n.General.process(generalinfo, null, null));

    };

    /**
     * Render the footer for profilewow
     */
    var renderTemplateFooter = function(){

        // Render the profilewow footer
        $profilewow_footer.html($.TemplateRenderer($profilewow_footer_template, sakai.profilewow.profile));

    };

    /**
     * Parse and render all the templates on the page
     */
    var renderTemplates = function(){

        // Render the site heading
        renderTemplateSiteHeading();

        // Render the user info
        renderTemplateUserInfo();

        // Render the general info
        renderTemplateGeneralInfo();

        // Render the footer buttons
        renderTemplateFooter();

    };


    ////////////////////
    // INITIALISATION //
    ////////////////////

    var doInit = function(){

        // Set the querystring object variable
        // We use the following parameters:
        //    mode -> mode of the profile
        //    user -> the id of the user for which you want to see the profile
        querystring = new Querystring();

        // Get and set the profile mode
        var profilemode = getProfileMode();
        if (profilemode) {
            setProfileMode(profilemode);
        }

        // Check if you are looking at the logged-in user
        setIsMe();

        // Set the profile data
        setProfileData(function(){

            // Render all the templates
            renderTemplates();

            // Add binding to all the elements
            addBinding();

        });

    };

    doInit();
};

sakai.api.Widgets.Container.registerForLoad("sakai.profilewow");