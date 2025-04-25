import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";

// ✅ Firebase configuration
const firebaseConfig = {
  databaseURL: "https://scrimba-aed68-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const complimentsRef = ref(database, "compliments");

// ✅ DOM elements
const toggleFormButton = document.getElementById('toggleFormButton');
const generateButton = document.getElementById('generateButton');
const complimentDisplay = document.getElementById('compliment-display');
const complimentForm = document.getElementById('complimentForm');
const complimentInput = document.getElementById('complimentInput');
const successMessage = document.getElementById('successMessage'); // ✅ select the element

// ✅ Toggle form visibility
toggleFormButton.addEventListener('click', () => {
  complimentForm.classList.toggle('hidden');
  toggleFormButton.textContent = complimentForm.classList.contains('hidden') 
    ? 'Add Kudos' 
    : 'Hide Form';
});

// ✅ Handle form submission
complimentForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newCompliment = complimentInput.value.trim();

  if (newCompliment !== '') {
    push(complimentsRef, { text: newCompliment })
      .then(() => {
        complimentInput.value = '';
        complimentForm.classList.add('hidden');
        toggleFormButton.textContent = 'Add Kudos';
        successMessage.textContent = "Kudos added successfully!"; // ✅ show success message
        successMessage.style.display="block"; // Show message

        setTimeout(() => {
          successMessage.style.display="none"; // ✅ hide after 2 seconds
        }, 3000);
    })
      .catch((error) => {
        console.error('❌ Error adding compliment:', error);
      });
  }
});

// ✅ Fetch all compliments and filter out nested/invalid ones
generateButton.addEventListener('click', () => {
  get(complimentsRef)
    .then((snapshot) => {
      const complimentsArray = [];

      snapshot.forEach((childSnapshot) => {
        const childVal = childSnapshot.val();

        // ✅ If this item is a valid compliment
        if (childVal && typeof childVal === 'object' && childVal.text && typeof childVal.text === 'string') {
          complimentsArray.push(childVal.text);
        } else {
          console.warn("⚠️ Skipped invalid/nested entry:", childVal);
        }
      });

      if (complimentsArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * complimentsArray.length);
        complimentDisplay.textContent = complimentsArray[randomIndex];
      } else {
        complimentDisplay.textContent = "No valid compliments found 😢";
      }
    })
    .catch((error) => {
      console.error("❌ Error fetching compliments:", error);
      complimentDisplay.textContent = "Something went wrong...";
    });
});
