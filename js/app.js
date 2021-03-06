/*
    TODOs:
        - Make registration form to recieve users from event sites
        - Projects tab (search, filter, click to show project)
        - Check-in page (search bar, easy to use)
*/

window.server = "https://api.gopilot.org"
window.dateFormat = "MM/DD/YYYY hh:mm A"
window.serverDateFormat = "YYYY-MM-DD HH:mm:ss"
var sessionCache = {
    user: null
};

$(document).click(function() {
    // all dropdowns
    $('.select-element').removeClass('open');
});

angular.module('app', [
    'ui.router',
    'pilot.auth',
    'pilot.portal',
    'ngCookies',
    'ngSanitize'
])
// Custom drop-down directive
.directive("customSelect", function(){
    return {
        require: '?ngModel',
        link: function(scope, element, attr, ngModel){
            console.log("customSelect");
            new CustomSelect(element[0], {
                onChange: function(value){
                    ngModel.$setViewValue(value);
                    scope.$apply()
                },
                ngModel: ngModel
            }, scope, attr);
        }
    }
})
.directive("fileUpload", function($http, $parse){
    function getType(ext){
        switch(ext) {
            case 'png':
                return 'image/png';
            case 'jpg':
                return 'image/jpeg';
            case 'jpeg':
                return 'image/jpeg';
            case 'gif':
                return 'image/gif';
            default:
                return 'image/*';
        }
    }

    function fileUpload(scope, element, attrs, controller){
        console.log('fileUpload')

        element.find('input').on('change', function(evt){
            var filetype = this.value.match(/(\w+)$/)[0]
            var image = this.files[0];
            
            scope.uploadWaiting = true

            $http.get(server+'/auth/request_upload/'+attrs.context+"?filetype="+filetype)
            .success(function(data){
                var url = data.file_url
                $http.put(data.upload_url, image, {
                    headers: {
                        'Content-Type': getType(filetype),
                        'x-ms-blob-type': "BlockBlob"
                    }
                })
                .success(function(data){
                    $parse(attrs['ngModel']).assign(scope, url);

                    if(scope.uploadWaiting){
                        scope.uploadWaiting = false;
                    }

                    console.log("URL is", $parse(attrs['ngModel'])(scope));
                })
            });

        })
    }

    return {
        require: '?ngModel',
        transclude: true,
        template: "<span ng-transclude></span><input type='file' accept='image/*' class='upload' ng-model='fileupload_data'/>",
        link: fileUpload
    }
})
.filter('markdown', function($sanitize){
    return function(input){
        return $sanitize(marked(input));
    }
})
