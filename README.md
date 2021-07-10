## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Additional code (must be include)
After install all python libraries please add the code below into 'dj-rest-auth' library.
django-rest-auth > serializers.py > between TokenSerializer and JWTSerializer

# custom code starts from here
from course.models import UserInfo
from group.models import Group
from django.contrib.auth.models import User

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = '__all__'


class GroupAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'username']


class GroupSerializer(serializers.ModelSerializer):
    created_by = GroupAdminSerializer(read_only=True)

    class Meta:
        model = Group
        fields = '__all__'


class UserDetailsSerializer(serializers.ModelSerializer):
    detail = UserInfoSerializer()
    is_members = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = UserModel
        fields = ('pk', 'username', 'email',
                  'first_name', 'last_name', 'is_staff', 'detail', 'is_members')
        read_only_fields = ('email', )
# custom code ends here
