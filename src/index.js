
// ok so, the full app can be viewed by just opening the index.html file in the browser

// the code below fulfills the following deliverables:
// >> fetching data from an api
// >> a like feature (both front-end and back-end)
// >> a comment feature (both front-end and back-end)

// it needs to be separated into the given classes - image.js and comment.js
// basically this is a sample app ill have to create for my challenge this week and i found this guys code for it and
// id like to understand in my way so that i can re-create it

// this is standard for most js apps in order to cut down on loading times
document.addEventListener('DOMContentLoaded', function() {

// we are setting all of the variables we'll need for this app
  const imageId = 2374
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`
  const image = document.getElementById("image")
  const imageName = document.getElementById("name")
  const likes = document.getElementById("likes")
  const likeButton = document.getElementById("likeButton")
  const commentForm = document.getElementById("comment_form")
  const comments = document.getElementById("comments")
  const commentInput = document.getElementById("comment_input")

// here, we are fetching info from the api to gather the data we'll use
// in my head, i would just call imageURL (since its already set) as the argument here, why are we intropolating?
  fetch(`${imageURL}`)
  .then(res=> res.json())
  .then(data => {
// why are we setting the attribute here? shouldnt we just be able to call image.data to gather that image?
    image.setAttribute("src",`${data.url}`)
// in a general sense, i would have probably put all of this into a function and just called it, why isnt he doing that?
// also, why is he sorting the comments? shouldnt he just have to call the function createComment?
// also, the flow of this is weird. this is setting what we see in the window, right? ...
// ... its the image, name of image, likes, comment box for input, then the list of comments. this isnt is that order and it works, why?
    data.comments.sort(function(a, b){return b.id - a.id}).forEach((comment)=> {
      comments.prepend(createComment(comment))
    })
// how is the button even showing up next to this? also, i understand how it pulls the like count, but it doesnt even specify the string "Likes:", but it still shows on the page?
    likes.innerText = data.like_count
    imageName.innerText = data.name
  })//end fetch

// how does the app know where to put this listener? by the html thats already in there? probably
  likeButton.addEventListener('click',() => {
// why does likes.innerText have to be redefined? what is parseInt doing? just grabbing the info?
      likes.innerText = parseInt(likes.innerText) +1
// why are we intropolating? also, in line 58 and 59... is it because it outlines this instance?
      fetch(`${likeURL}`, {
        method: "POST",
        headers: {'Accept': 'application/json',
                'Content-Type': 'application/json'},
        body: JSON.stringify({
          image_id: `${imageId}`,
          like_count: `${likes.innerText}`})
      }).then(res=> res.json())//end fetch

  })//end button event listener

// i get whats happening here
  commentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    fetch(`${commentsURL}`, {
      method: "POST",
      headers: {'Accept': 'application/json',
              'Content-Type': 'application/json'},
      body: JSON.stringify({
        image_id: `${imageId}`,
        content: `${commentInput.value}`
      })
    }).then(res => res.json())
  // grab the comments from the api and tack on any new comments to it, right?
    .then(comment => {
    comments.append(createComment(comment))
    })
    commentForm.reset()
  })

comments.addEventListener('click', () => {
    if (event.target.hasAttribute('data-id')){
      let parentLi = event.target.parentNode
      fetch(`https://randopic.herokuapp.com/comments/${event.target.getAttribute('data-id')}`, {
        method: "DELETE"
      }).then(res => res.json())
      .then(data => window.alert("comment deleted"))
      parentLi.remove()
    }
})

})//end DOM content loaded

function createDeleteButton(comment){
  let delete_button = document.createElement('button')
  delete_button.dataset.id = comment.id
  delete_button.innerText ="delete comment"
  return delete_button
}

// why not comment_input?
function createComment(comment_data){
  let new_comment = document.createElement('li')
  new_comment.innerText = comment_data.content
  new_comment.append(createDeleteButton(comment_data))
  return new_comment
}
