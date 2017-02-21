/**
 * Created by XME3612 on 20/02/2017.
 */
new Vue({
    el:'#root',
    data:{
        collaborator:{
            personnalIdNumber:'',
            firstName:'',
            lastName:'',
            email:'',
            password:'',
            confirmPassword:''
        },
        collaboratorToRegister:{}, // on le définit dans la fonction verifyFrom()
        isNewPersonalIdNumber:true,
        isNewEmail:true
    },
    methods:{
        resetForm() {
            this.collaborator.personnalIdNumber = '';
            this.collaborator.lastName = '';
            this.collaborator.firstName = '';
            this.collaborator.email = '';
            this.collaborator.password = '';
            this.collaborator.confirmPassword = '';
        },
        saveAction() {
            this.collaboratorToRegister.lastName = this.collaborator.lastName.replace(" ", "");  //delete useless spaces between words
            this.collaboratorToRegister.firstName = this.collaborator.firstName.replace(" ", "");  //delete useless spaces between words
            delete this.collaboratorToRegister['confirmPassword'];  //delete la confirmation de password

            //post the form to the server
            this.$http.post("api/collaborateurs", this.collaboratorToRegister)
                .then(
                    function (response) {
                        this.isNewEmail = true;
                        this.isNewPersonalIdNumber = true;

                        resetForm(); //Reset the Form
                        window.location.replace('pageblanche.html');
                        //$location.url('/Authentication'); //???????
                    },
                    function (response) {
                        console.log("Error: ",response);
                        if (response.json().message === "personnalIdNumber") { //message: defini dans la partie java exception ??
                            this.isNewPersonalIdNumber = false;
                            this.isNewEmail = true;
                        }
                        else if(response.json().message === "email"){
                            this.isNewEmail = false;
                            this.isNewPersonalIdNumber = true;
                        }else{
                            console.error(response);
                        }
                    }
                );
        },
        verifyForm() {
            this.isNewPersonalIdNumber = true;
            this.isNewEmail = true;
            this.collaboratorToRegister = JSON.parse(JSON.stringify(this.collaborator));
            saveAction();
        }
    }

});