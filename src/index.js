document.addEventListener('DOMContentLoaded', function() {

  const imageId = 72 //Enter your assigned imageId here
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`
  const image = document.getElementById("image")
  const likes = document.getElementById("likes")
  const like_button = document.getElementById("like_button")
  const commentForm = document.getElementById("comment_form")
  const comments = document.getElementById("comments")

  fetch(`${imageURL}`)
  .then(res=> res.json())
  .then(data => {image.setAttribute("src",`${data.url}`)
  data.comments.sort(function(a, b){return b.id - a.id}).forEach((comment)=> {
    let new_comment = document.createElement('li')
    new_comment.innerText =comment.content
    let delete_button = document.createElement('button')
    delete_button.dataset.id = comment.id
    delete_button.innerText ="delete comment"
    new_comment.append(delete_button)
    comments.prepend(new_comment)
  })
  likes.innerText = data.like_count
  })//end fetch

  like_button.addEventListener('click',() => {
      likes.innerText = parseInt(likes.innerText) +1
      fetch(`${likeURL}`, {
        method: "POST",
        headers: {'Accept': 'application/json',
                'Content-Type': 'application/json'},
        body: JSON.stringify({
          image_id: `${imageId}`,
          like_count: `${likes.innerText}`})
      }).then(res=> res.json())//end fetch

  })//end button event listener

  commentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    commentInput = document.getElementById("comment_input")

    let new_comment = document.createElement('li')
    new_comment.innerText = commentInput.value

    fetch(`${commentsURL}`, {
      method: "POST",
      headers: {'Accept': 'application/json',
              'Content-Type': 'application/json'},
      body: JSON.stringify({
        image_id: `${imageId}`,
        content: `${commentInput.value}`
      })
    }).then(res => res.json())
    .then(comment => {
    let delete_button = document.createElement('button')
    delete_button.dataset.id = comment.id
    delete_button.innerText ="delete comment"
    new_comment.append(delete_button)
    })
    comments.append(new_comment)
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
