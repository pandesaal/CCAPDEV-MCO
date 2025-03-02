import { commentInjector, comments } from "./comment-injector.js";

export const postInjector = () => {

    document.querySelectorAll('.post-options-button').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.post').querySelector('.post-menu').classList.toggle('hide')
        })
    })
    
    // Post Menu Button: Edit
    document.querySelectorAll('.editBtn').forEach(button => {
        button.addEventListener('click', () => {
            const post = button.closest('.post');
            const title = post.querySelector('.post-title h3').innerText;
            const content = post.querySelector('.post-content').innerText;
    
            document.getElementById('editPostTextTitle').value = title;
            document.getElementById('editPostTextContent').value = content;
    
            // Get the tags from the post and display them in the edit modal
            const tags = post.querySelectorAll('.post-tag');
            const editPostTagsContainer = document.getElementById('editPostTagList');
            editPostTagsContainer.innerHTML = ''; // Clear existing tags
    
            tags.forEach(tag => {
                const tagElement = document.createElement('div');
                tagElement.className = 'tag';
                tagElement.innerHTML = `
                    <span>${tag.innerText}</span>
                    <span><button class="remove-tag-button">×</button></span>
                `;
                editPostTagsContainer.appendChild(tagElement);
            });
    
            // Show the edit modal
            document.getElementById('editModal').classList.remove('hide');
    
            // Add event listeners to remove tag buttons
            document.querySelectorAll('.remove-tag-button').forEach(removeButton => {
                removeButton.addEventListener('click', (e) => {
                    e.target.closest('.tag').remove(); // Remove the tag element
                });
            });
        });
    });
    
    // Edit Post Button: Edit
    document.getElementById('editPostBtn').addEventListener('click', () => {
        const newTitle = document.getElementById('editPostTextTitle').value;
        const newContent = document.getElementById('editPostTextContent').value;
        console.log('Updated Title:', newTitle);
        console.log('Updated Content:', newContent);
    
        document.getElementById('editModal').classList.add('hide');
    });
    
    // Edit Post Button: Cancel
    document.getElementById('cancelPostBtn').addEventListener('click', () => {
        document.getElementById('editModal').classList.add('hide');
    });
    
    // Post Menu Button: Delete
    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', () => {
            if (button.closest('.post'))
                document.getElementById('deletePostModal').classList.remove('hide')
        })
    })
    
    // Close a modal when the close button is clicked
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.classList.add('hide')
        });
    });
};