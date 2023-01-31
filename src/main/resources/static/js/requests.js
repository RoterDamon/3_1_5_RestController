let roleList = [
    {roleId: 1, name: "ROLE_USER"},
    {roleId: 2, name: "ROLE_ADMIN"}
]
let isUser = true;

$(async function () {
    await getUser();
    await infoUser();
    await tittle();
    await getUsers();
    await getNewUserForm();
    await getDefaultModal();
    await createUser();

})

const userFetch = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAll: async () => await fetch('api/users'),
    findUser: async () => await fetch(`api/user`),
    findUserById: async (id) => await fetch(`api/user/${id}`),
    addUser: async (user) => await fetch('api/add', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`api/update/${id}`, {
        method: 'PUT',
        headers: userFetch.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`api/delete/${id}`, {method: 'DELETE', headers: userFetch.head})
}

async function infoUser() {
    let temp = '';
    const info = document.querySelector('#info');
    let oneUser = await userFetch.findUser();
    let user = oneUser.json();
    user.then(user => {
            temp += `
             <span style="color: white">
               ${user.username} with roles <span>${Array.isArray(user.roles) ? user.roles.map(role => role.name) : null}</span>
                </div>
            </span>
                </tr>
            `;
        });
    info.innerHTML = temp;
}

async function getUser() {
    let temp = '';
    const table = document.querySelector('#tableUser tbody');
    let oneUser = await userFetch.findUser();
    let user = oneUser.json();
    user.then(user => {
            temp = `
                <tr>
                    <td>${user.userId}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${Array.isArray(user.roles) ? user.roles.map(role => role.name) : null}</td>
                </tr>
            `;
            table.innerHTML = temp;

            $(function () {
                let role = ""
                for (let i = 0; i < user.roles ? user.roles.length : null; i++) {
                    role = user.roles[i].role
                    if (role === "ROLE_ADMIN") {
                        isUser = false;
                    }
                }
                if (isUser) {
                    $("#userTable").addClass("show active");
                    $("#userTab").addClass("show active");
                } else {
                    $("#adminTable").addClass("show active");
                    $("#adminTab").addClass("show active");
                }
            })
        })
}

async function tittle() {
    let temp = ''
    const h1a1 = document.querySelector('#h1a1');
    if (isUser) {
        temp = `
            <h1 className="h1 a1" id="h1a1">User information page</h1>
            `;
        h1a1.innerHTML = temp;
    } else {
        temp = `
            <h1 className="h1 a1" id="h1a1">Admin panel</h1>
            `;
        h1a1.innerHTML = temp;
    }
}

async function getUsers() {
    let temp = '';
    const table = document.querySelector('#tableAllUsers tbody');
    await userFetch.findAll()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                temp += `
                <tr>
                    <td>${user.userId}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${Array.isArray(user.roles) ? user.roles.map(role => role.name) : null}</td>
                    <td>
                        <button type="button" data-userid="${user.userId}" data-action="update" class="btn btn-info"
                            className data-toggle="modal" data-target="#updateModal">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-userid="${user.userId}" data-action="delete" class="btn btn-danger"
                            className data-toggle="modal" data-target="#deleteModal">Delete</button>
                    </td>
                </tr>
               `;
            })
            table.innerHTML = temp;

        })

    $("#tableAllUsers").find('button').on('click', (event) => {
        let defaultModal = $('#defaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getNewUserForm() {
    let button = $(`#addUser`);
    let form = $(`#addForm`)
    button.on('click', () => {
        form.show()
    })
}

async function getDefaultModal() {
    $('#defaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'update':
                updateUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}