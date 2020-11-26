// 2.1 INDEX -- get 
export async function getTweet() { 
    const $root = $('#root');
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
    });

    let tweets = `<div id="tweets">`; 
    let likecolor="";
    let likemsg="";
    let likelabel="";
    for(let i=0; i<result.data.length; i++){
        if(result.data[i].isLiked){
            likecolor = "red";
            likemsg="You Liked This<3";
            likelabel = "Unlike";
        }else{
            likecolor = "lightgrey";
            likemsg="You Have Not Liked This:(";
            likelabel="Like";
        }

        let date = new Date(result.data[i].updatedAt *1000);
        let dateString = date.toGMTString();
        let start = dateString.slice(0,11);
        let end = dateString.slice(17,25);
        tweets += 
        `<div class="tweet" id="tweet${result.data[i].id}">
            <div class="top"><p class='author'>${result.data[i].author}</p>
                <div class="times"><p class='time'>${start+end}</p></div>
            </div>
            <p class='msg' id="msg${result.data[i].id}">${result.data[i].body}</p>
            <div class="stats">
                <p class='likeCount'>Likes: ${result.data[i].likeCount}</p>
                <p class='replyCount'>Replies: ${result.data[i].replyCount}</p>
                <p class='retweetCount'>Retweets: ${result.data[i].retweetCount}</p>
            </div>
            <div class="stats"> 
                <button class='likeBtn' style="background-color: ${likecolor}; height:25px" id="like${result.data[i].id}" value="${result.data[i].isLiked}">${likelabel}</button>
                <button class='replyBtn' id="reply${result.data[i].id}" style="height:25px">Reply</button>
                <button class='retweetBtn' id="rt${result.data[i].id}" style="height:25px">Retweet</button>
            </div>
            <p class='isLiked' style="color:grey">${likemsg}</p>`;

            if(result.data[i].isMine){
                tweets += 
                `<div class="mystats">
                    <button class='editBtn' id="edit${result.data[i].id}" value="${result.data[i].body}">Edit</button>
                    <button class='deleteBtn'id="del${result.data[i].id}">Delete</button>
                </div><br>`;
            }

        tweets += `</div>`;
    }

    tweets += `</div>`;
    $root.append(tweets);
}

// 2.2 CREATE -- post 
export async function post(e){
    $("#post").replaceWith(
        `<form class="post" id="post">
            <textarea id="firstTweet">Type your Tweet Here!</textarea><br>
            <button class="posted" type="submit">Submit</button>
        </form>`);
}

export async function postTweet(e){
    e.preventDefault();

    const result = await axios({  
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "tweet",
            "body":  $("#firstTweet").val(),  
        },
    });
    $("#post").replaceWith(`<button class="postBtn" id="post">Post</button><br></br>`);
    $('#tweets').replaceWith(getTweet());
}
// 2.3 READ -- get 

// 2.4 UPDATE -- edit 
export async function edit(e){
    let msg = e.target.value;
    let id = e.target.id.slice(4);

    $("#msg"+id).replaceWith(
        `<div align="center">
            <form id="editing${id}" class="edit">
                <textarea id="editmsg${id}">${msg}</textarea><br></br>
                <button class="edited" id="edited${id}" type="submit">Submit</button>
            </form>
        </div>`);
}

export async function updateEdit(e){  
    e.preventDefault();

    let id = e.target.id.slice(7);
    let body = $("#editmsg"+id).val();

    const result = await axios({
        method: 'put',
        url: "https://comp426-1fa20.cs.unc.edu/a09/tweets/" + id,
        withCredentials: true,
        data: {
           "body": body,
        },
    });
    $('#tweets').replaceWith(getTweet());
}

// 2.5 DESTROY
export async function destroy(e){
    let id = e.target.id.slice(3);
    const result = await axios({
        method: 'delete',
        url: "https://comp426-1fa20.cs.unc.edu/a09/tweets/" + id, 
        withCredentials: true,
    }); 
    $('#tweets').replaceWith(getTweet());
}

// 2.6-7 LIKE/UNLIKE
export async function like(e){
    let id = e.target.id.slice(4);

    if (e.target.value=="false") { 
        const result = await axios({
            method: 'put',
            url: "https://comp426-1fa20.cs.unc.edu/a09/tweets/" + id + "/like",
            withCredentials: true,
          });     
    } else {
        const result = await axios({
            method: 'put',
            url: "https://comp426-1fa20.cs.unc.edu/a09/tweets/" + id + "/unlike",
            withCredentials: true,
          }); 
    }
    $('#tweets').replaceWith(getTweet());
}

// 4.1 REPLY 
export async function reply(e){
    let id = e.target.id.slice(5);
    let replyForm = 
        `<div align="center">
            <form id="replyform${id}" class="reply">
                <textarea id="r${id}">Type Response Here!</textarea><br></br>
                <button id="replied${id}" class="replied" type="submit">Submit</button>
            </form>
        </div>`;
    $("#tweet"+id).append(replyForm);
}

export async function sendReply(e){
    e.preventDefault();

    let id = e.target.id.slice(9);
    let body = $("#r"+id).val();

    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          "type": "reply",
          "parent": id,
          "body": body,
        },
    });
    $('#tweets').replaceWith(getTweet());
}

// 4.1 RETWEET
export async function retweet(e){
    let id = e.target.id.slice(2);
    let rtForm = 
        `<div align="center">
            <form id="rtF${id}" class="retweet">
                <textarea id="rtmsg${id}"> Type Retweet Here!</textarea><br></br>
                <button class="retweeted" type="submit">Submit</button>
            </form>
        </div>`;
    $("#tweet"+id).append(rtForm);    
}

export async function makeRT(e){
    e.preventDefault();
    let id = e.target.id.slice(3);
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
    });
    
    let tweet2RT = {};
    for(let i=0; i<result.data.length; i++){
        if(result.data[i].id == id){
            tweet2RT = result.data[i];
        }
    }
    let oldbody = tweet2RT.body;
    let author = tweet2RT.author;
    let body = $("#rtmsg"+id).val();
    body = "Retweeting " + author + "'s tweet: '" + oldbody + "' "+`<br></br>`+ body;
    const result2 = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "retweet",
            "parent": id,
            "body": body,
        },
    });

    $('#tweets').replaceWith(getTweet());
    
}

$(function() {
    const $root = $('#root');
    let thepost = 
    `<div class="margin"><div class="first" style="background-color: #e0ffff" >
        <div align="center" >
            <p>Make a Tweet!</p>
            <button class="postBtn" id="post">Post</button><br></br>
        </div>
    </div>`;
    $root.append(thepost);
    getTweet(); 

    $(document).on("click", ".likeBtn", like);
    $(document).on("click", ".deleteBtn", destroy);

    $(document).on("click", ".postBtn", post);
    $(document).on("submit", ".post", postTweet);

    $(document).on("click", ".editBtn", edit);
    $(document).on("submit", ".edit", updateEdit);

    $(document).on("click", ".replyBtn", reply);
    $(document).on("submit", ".reply", sendReply);

    $(document).on("click", ".retweetBtn", retweet);
    $(document).on("submit", ".retweet", makeRT);

    window.onscroll = function(e) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            let tweets = getTweet(); 
            document.body.append(tweets); 
        }
    };

});
