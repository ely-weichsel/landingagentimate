// Animation variables
let animationCanvas;
let animationCursor;
let showcaseElement;
let conversationTimeout;
let currentAnimation = null;
let isTyping = false;
let mouseX = 0;
let mouseY = 0;
let isMouseDown = false;
let idleTimeout;
let activeAnimation = 'default';
let particles = [];

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize elements
  animationCanvas = document.getElementById('animation-canvas');
  animationCursor = document.querySelector('.animation-cursor');
  showcaseElement = document.getElementById('idea-visualization');
  
  // Set up conversation interface
  setupConversation();
  
  // Initial animations
  initBackgroundAnimation();
  
  // Set up UI animations
  animateUI();
});

// Set up conversation interface
function setupConversation() {
  const conversationInput = document.getElementById('conversation-input');
  const sendButton = document.getElementById('send-message');
  const heroInput = document.getElementById('idea-input');
  const animateButton = document.getElementById('animate-btn');
  const exampleButtons = document.querySelectorAll('.example-btn');
  
  // Send message when button is clicked
  sendButton.addEventListener('click', () => {
    const message = conversationInput.value.trim();
    if (message) {
      sendUserMessage(message);
      conversationInput.value = '';
    }
  });
  
  // Send message when Enter key is pressed
  conversationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const message = conversationInput.value.trim();
      if (message) {
        sendUserMessage(message);
        conversationInput.value = '';
      }
    }
  });
  
  // Hero section input
  animateButton.addEventListener('click', () => {
    const message = heroInput.value.trim();
    if (message) {
      // Scroll to demo section
      const demoSection = document.getElementById('demo');
      demoSection.scrollIntoView({ behavior: 'smooth' });
      
      // Wait for scrolling to finish then send message
      setTimeout(() => {
        sendUserMessage(message);
        heroInput.value = '';
      }, 800);
    }
  });
  
  // Hero section Enter key
  heroInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const message = heroInput.value.trim();
      if (message) {
        // Scroll to demo section
        const demoSection = document.getElementById('demo');
        demoSection.scrollIntoView({ behavior: 'smooth' });
        
        // Wait for scrolling to finish then send message
        setTimeout(() => {
          sendUserMessage(message);
          heroInput.value = '';
        }, 800);
      }
    }
  });
  
  // Example buttons
  exampleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const example = button.getAttribute('data-example');
      let message = '';
      
      switch (example) {
        case 'galaxy':
          message = 'Show me a rotating galaxy animation';
          break;
        case 'explodingText':
          message = 'Create an exploding text animation';
          break;
        case 'colorWaves':
          message = 'I want to see color waves';
          break;
        case 'geometricShapes':
          message = 'Make geometric shapes that transform';
          break;
        case 'timeline':
          message = 'Show me a timeline animation';
          break;
        case 'staggering':
          message = 'Create a staggered animation';
          break;
        case 'svgDrawing':
          message = 'Can you make an SVG drawing animation?';
          break;
      }
      
      if (message) {
        sendUserMessage(message);
      }
    });
  });
}

// Send a user message to the conversation
function sendUserMessage(message) {
  if (isTyping) return; // Prevent sending new messages while bot is typing
  
  // Add user message to the conversation
  const messagesContainer = document.getElementById('conversation-messages');
  const userMessageElement = document.createElement('div');
  userMessageElement.classList.add('message', 'user');
  userMessageElement.innerHTML = `
    <div class="avatar">👤</div>
    <div class="message-content">
      <p>${message}</p>
    </div>
  `;
  messagesContainer.appendChild(userMessageElement);
  
  // Scroll to the bottom of the conversation
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Show typing indicator
  showTypingIndicator();
  
  // Process user message and respond
  processUserMessage(message);
}

// Show typing indicator while the bot is "thinking"
function showTypingIndicator() {
  isTyping = true;
  const messagesContainer = document.getElementById('conversation-messages');
  const typingElement = document.createElement('div');
  typingElement.classList.add('message', 'bot', 'typing-indicator');
  typingElement.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="message-content">
      <div class="typing">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  messagesContainer.appendChild(typingElement);
  
  // Scroll to the bottom of the conversation
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.querySelector('.typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
  isTyping = false;
}

// Process user message and generate appropriate response
function processUserMessage(message) {
  message = message.toLowerCase();
  
  // Clear any existing animation
  clearAnimation();
  
  // Determine which animation to show based on the message
  let animationType = 'default';
  let responseMessage = '';
  let codeSnippet = '';
  
  // Check if it's our special magical ideas prompt
  if (message.includes('magical') || message.includes('imagination') || message.includes('ideas to life') || message.includes('ai animation')) {
    animationType = 'magicalIdeas';
    responseMessage = `I've created a magical ideas animation that visualizes how AI transforms your thoughts into animated reality. The particles follow your cursor and form patterns as you move around - showing how your ideas transform into visual elements with just a thought!`;
    codeSnippet = `// AI-driven animation generation
anime({
  targets: '.idea-particle',
  translateX: function(el, i) {
    return anime.random(-300, 300);
  },
  translateY: function(el, i) {
    return anime.random(-300, 300);
  },
  scale: function(el, i) {
    return anime.random(0.1, 2);
  },
  opacity: function(el, i) {
    return anime.random(0.2, 1);
  },
  duration: function() { return anime.random(1000, 3000); },
  delay: anime.stagger(10, {grid: [20, 20], from: 'center'}),
  direction: 'alternate',
  loop: true
});`;
  } 
  else if (message.includes('galaxy') || message.includes('stars') || message.includes('rotating')) {
    animationType = 'galaxy';
    responseMessage = `I'll create a rotating galaxy animation for you! This is created using particles that rotate around a central point, with varying distances and speeds.`;
    codeSnippet = `anime({
  targets: '.dot',
  translateX: function(el) {
    return anime.random(-250, 250);
  },
  translateY: function(el) {
    return anime.random(-250, 250);
  },
  scale: function() { return anime.random(0.2, 1); },
  duration: function() { return anime.random(1000, 3000); },
  delay: function() { return anime.random(0, 400); },
  direction: 'alternate',
  loop: true
});`;
  } 
  else if (message.includes('text') || message.includes('explode') || message.includes('letter')) {
    animationType = 'explodingText';
    responseMessage = `Here's an exploding text animation! Each letter is animated independently, first exploding outward and then reforming back into the original text.`;
    codeSnippet = `// Create animation for each letter
anime.timeline({loop: true})
  .add({
    targets: '.letter',
    scale: [0, 1],
    duration: 1500,
    elasticity: 600,
    delay: (el, i) => 45 * (i+1)
  }).add({
    targets: '.letter',
    translateX: function() { return anime.random(-200, 200); },
    translateY: function() { return anime.random(-200, 200); },
    rotate: function() { return anime.random(-180, 180); },
    duration: 1500,
    delay: 500
  }).add({
    targets: '.letter',
    translateX: 0,
    translateY: 0,
    rotate: 0,
    duration: 1500,
    delay: 1000
  });`;
  } 
  else if (message.includes('wave') || message.includes('color') || message.includes('ripple')) {
    animationType = 'colorWaves';
    responseMessage = `I've created a color wave animation for you! This creates expanding circular gradients that create a ripple effect.`;
    codeSnippet = `function createWave() {
  const wave = document.createElement('div');
  wave.classList.add('wave');
  container.appendChild(wave);
  
  anime({
    targets: wave,
    width: '200%',
    height: '200%',
    opacity: [0.8, 0],
    easing: 'easeOutSine',
    duration: 3000,
    complete: function() {
      container.removeChild(wave);
    }
  });
}`;
  } 
  else if (message.includes('shape') || message.includes('geometric') || message.includes('transform')) {
    animationType = 'geometricShapes';
    responseMessage = `Here are some animated geometric shapes! Each shape has its own animation pattern with different rotations, scales, and positions.`;
    codeSnippet = `anime({
  targets: '.shape',
  translateX: function() { return anime.random(-50, 50); },
  translateY: function() { return anime.random(-50, 50); },
  scale: function() { return anime.random(0.2, 2); },
  rotate: function() { return anime.random(0, 360); },
  borderRadius: function() { return anime.random(0, 50) + '%'; },
  duration: function() { return anime.random(1000, 3000); },
  delay: function() { return anime.random(0, 400); },
  direction: 'alternate',
  loop: true
});`;
  } 
  else if (message.includes('timeline') || message.includes('sequence')) {
    animationType = 'timeline';
    responseMessage = `This is a timeline animation! Timeline animations let you sequence multiple animations one after another or with specific delays.`;
    codeSnippet = `const timeline = anime.timeline({
  easing: 'easeOutExpo',
  duration: 750
});

timeline
  .add({
    targets: '.element-1',
    translateX: 250
  })
  .add({
    targets: '.element-2',
    translateX: 250
  }, '-=600')
  .add({
    targets: '.element-3',
    translateX: 250
  }, '-=800');`;
  } 
  else if (message.includes('stagger') || message.includes('grid') || message.includes('delay')) {
    animationType = 'staggering';
    responseMessage = `Here's a staggered animation! Staggering creates a cascading effect by adding incremental delays to elements in a group.`;
    codeSnippet = `anime({
  targets: '.grid-item',
  scale: [
    {value: .1, easing: 'easeOutSine', duration: 500},
    {value: 1, easing: 'easeInOutQuad', duration: 1200}
  ],
  delay: anime.stagger(200, {grid: [14, 5], from: 'center'})
});`;
  } 
  else if (message.includes('svg') || message.includes('drawing') || message.includes('line')) {
    animationType = 'svgDrawing';
    responseMessage = `Here's an SVG drawing animation! This technique animates the stroke of an SVG path to create a drawing effect.`;
    codeSnippet = `anime({
  targets: 'path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 1500,
  delay: function(el, i) { return i * 250 },
  direction: 'alternate',
  loop: true
});`;
  } 
  else {
    animationType = 'default';
    responseMessage = `I've created a particle animation based on your request! These particles move randomly and react to mouse movements.`;
    codeSnippet = `anime({
  targets: '.particle',
  translateX: function() { return anime.random(-100, 100); },
  translateY: function() { return anime.random(-100, 100); },
  scale: function() { return anime.random(0.2, 1.5); },
  easing: 'easeInOutQuad',
  duration: function() { return anime.random(1200, 3000); },
  complete: function(anim) {
    // Loop the animation
    animateParticle(anim.animatable.target);
  }
});`;
  }
  
  // Simulate thinking time - remove typing indicator and send response after a delay
  setTimeout(() => {
    removeTypingIndicator();
    sendBotResponse(responseMessage, codeSnippet, animationType);
  }, 1500);
}

// Send a bot response message
function sendBotResponse(message, codeSnippet, animationType) {
  const messagesContainer = document.getElementById('conversation-messages');
  
  // Create the bot message element
  const botMessageElement = document.createElement('div');
  botMessageElement.classList.add('message', 'bot');
  
  // Set the message content with optional code snippet
  let messageContent = `<div class="avatar">🤖</div>
    <div class="message-content">
      <p>${message}</p>`;
  
  if (codeSnippet) {
    messageContent += `<pre><code>${codeSnippet}</code></pre>`;
  }
  
  messageContent += '</div>';
  botMessageElement.innerHTML = messageContent;
  
  // Add the message to the conversation
  messagesContainer.appendChild(botMessageElement);
  
  // Scroll to the bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Create the animation based on the type
  createAnimation(animationType);
}

// Create animation based on type
function createAnimation(type) {
  const container = showcaseElement;
  
  // Clear previous animations
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  
  switch (type) {
    case 'magicalIdeas':
      createMagicalIdeasAnimation();
      break;
    case 'galaxy':
      createGalaxyAnimation();
      break;
    case 'explodingText':
      createExplodingTextAnimation();
      break;
    case 'colorWaves':
      createColorWavesAnimation();
      break;
    case 'geometricShapes':
      createGeometricShapesAnimation();
      break;
    case 'timeline':
      createTimelineAnimation();
      break;
    case 'staggering':
      createStaggeringAnimation();
      break;
    case 'svgDrawing':
      createSvgDrawingAnimation();
      break;
    default:
      createDefaultAnimation();
  }
}

// Clear current animation
function clearAnimation() {
  const container = showcaseElement;
  
  // Stop all animations
  anime.remove(container.querySelectorAll('*'));
  
  // Clear animation elements
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  
  // Clear current animation reference
  currentAnimation = null;
}

// Initialize background animation
function initBackgroundAnimation() {
  // Create subtle background animation in the animation-canvas
  const canvas = animationCanvas;
  const numParticles = 30;
  
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random size between 2-5px
    const size = Math.random() * 3 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Blue-purple color range
    const hue = Math.random() * 60 + 200;
    particle.style.backgroundColor = `hsla(${hue}, 80%, 60%, 0.3)`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    canvas.appendChild(particle);
    
    // Animate the particle
    anime({
      targets: particle,
      translateX: () => anime.random(-50, 50),
      translateY: () => anime.random(-50, 50),
      opacity: [0.2, 0.5, 0.2],
      easing: 'easeInOutSine',
      duration: () => anime.random(8000, 15000),
      loop: true,
      direction: 'alternate'
    });
  }
  
  // Mouse cursor effect
  document.addEventListener('mousemove', (e) => {
    // Update cursor position
    animationCursor.style.opacity = '0.6';
    animationCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    
    // Hide cursor after inactivity
    clearTimeout(conversationTimeout);
    conversationTimeout = setTimeout(() => {
      animationCursor.style.opacity = '0';
    }, 3000);
  });
}

// Animate UI elements
function animateUI() {
  // Animate logo dot
  anime({
    targets: '.logo-dot',
    translateY: [
      { value: -3, duration: 1000 },
      { value: 0, duration: 1000 }
    ],
    scale: [
      { value: 1.2, duration: 900 },
      { value: 1, duration: 900 }
    ],
    easing: 'easeInOutSine',
    direction: 'alternate',
    loop: true
  });
  
  // Animate the text underline
  anime({
    targets: '.animated-text::after',
    scaleX: [0, 1],
    opacity: [0.5, 1],
    easing: 'easeInOutQuad',
    duration: 1500,
    delay: 500
  });
  
  // Typewriter effect for animated text
  const animatedText = document.querySelector('.animated-text');
  if (animatedText) {
    const originalText = animatedText.textContent;
    animatedText.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < originalText.length) {
        animatedText.textContent += originalText.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
        
        // Animate text color after typing
        anime({
          targets: '.animated-text',
          color: [
            { value: '#FF4B4B', duration: 1000 },
            { value: '#FB89FB', duration: 1000 }
          ],
          easing: 'easeInOutSine',
          direction: 'alternate',
          loop: true
        });
      }
    }, 150);
  }
  
  // Animate process steps on scroll
  const processSteps = document.querySelectorAll('.process-step');
  const stepsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
          easing: 'easeOutElastic(1, .5)'
        });
        
        // Animate step number
        const stepNumber = entry.target.querySelector('.step-number');
        if (stepNumber) {
          anime({
            targets: stepNumber,
            scale: [0, 1],
            rotate: ['180deg', '0deg'],
            duration: 1000,
            delay: 200,
            easing: 'easeOutBack'
          });
        }
        
        stepsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  processSteps.forEach(step => {
    step.style.opacity = '0';
    stepsObserver.observe(step);
  });
}

// Animation creation functions
function createGalaxyAnimation() {
  const container = showcaseElement;
  container.className = 'example-galaxy';
  
  const numParticles = 150;
  const centerX = container.offsetWidth / 2;
  const centerY = container.offsetHeight / 2;
  
  for (let i = 0; i < numParticles; i++) {
    const dot = document.createElement('div');
    dot.classList.add('particle');
    
    // Set size and color based on distance from center
    const size = Math.random() * 6 + 2;
    const hue = 210 + Math.random() * 50;
    const lightness = 50 + Math.random() * 30;
    
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.backgroundColor = `hsl(${hue}, 80%, ${lightness}%)`;
    dot.style.left = `${centerX}px`;
    dot.style.top = `${centerY}px`;
    
    container.appendChild(dot);
  }
  
  // Animate the galaxy
  currentAnimation = anime({
    targets: container.querySelectorAll('.particle'),
    translateX: function() {
      return anime.random(-200, 200); 
    },
    translateY: function() {
      return anime.random(-200, 200);
    },
    scale: function() {
      return anime.random(0.2, 1.5);
    },
    opacity: function() {
      return anime.random(0.3, 0.8);
    },
    easing: 'easeOutCirc',
    duration: function() {
      return anime.random(1000, 3000);
    },
    delay: function() {
      return anime.random(0, 500);
    },
    complete: function(anim) {
      // Create rotation animation after initial spread
      const particles = container.querySelectorAll('.particle');
      
      anime({
        targets: particles,
        rotate: [0, '1turn'],
        easing: 'linear',
        duration: 12000,
        loop: true
      });
    }
  });
}

function createExplodingTextAnimation() {
  const container = showcaseElement;
  container.className = 'example-text';
  
  const text = 'AGENTIMATE';
  
  // Create a span for each letter
  for (let i = 0; i < text.length; i++) {
    const letter = document.createElement('span');
    letter.classList.add('letter');
    letter.textContent = text[i];
    container.appendChild(letter);
  }
  
  // Create the animation timeline
  currentAnimation = anime.timeline({
    loop: true
  })
  .add({
    targets: '.letter',
    scale: [0, 1],
    duration: 1500,
    elasticity: 600,
    delay: (el, i) => 45 * (i+1)
  }).add({
    targets: '.letter',
    translateX: function() { return anime.random(-200, 200); },
    translateY: function() { return anime.random(-200, 200); },
    rotate: function() { return anime.random(-180, 180); },
    duration: 1500,
    delay: 500
  }).add({
    targets: '.letter',
    translateX: 0,
    translateY: 0,
    rotate: 0,
    duration: 1500,
    delay: 1000
  });
}

function createColorWavesAnimation() {
  const container = showcaseElement;
  container.className = 'example-waves';
  
  // Create initial waves
  for (let i = 0; i < 5; i++) {
    createWave(container, i * 600);
  }
  
  // Add mouse interaction
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createWaveAtPosition(container, x, y);
  });
}

function createWave(container, delay = 0) {
  const wave = document.createElement('div');
  wave.classList.add('wave');
  
  // Random color
  const colors = [
    'rgba(90, 135, 255, 0.2)',
    'rgba(132, 83, 227, 0.2)',
    'rgba(255, 75, 75, 0.2)',
    'rgba(251, 137, 251, 0.2)',
    'rgba(61, 195, 255, 0.2)',
    'rgba(24, 255, 116, 0.2)'
  ];
  
  wave.style.background = colors[Math.floor(Math.random() * colors.length)];
  wave.style.width = '10px';
  wave.style.height = '10px';
  wave.style.left = '50%';
  wave.style.top = '50%';
  
  container.appendChild(wave);
  
  anime({
    targets: wave,
    width: '200%',
    height: '200%',
    left: '-50%',
    top: '-50%',
    opacity: [0.8, 0],
    easing: 'easeOutSine',
    duration: 4000,
    delay: delay,
    complete: function() {
      if (container.contains(wave)) {
        container.removeChild(wave);
        // Create a new wave to replace this one
        createWave(container, 0);
      }
    }
  });
}

function createWaveAtPosition(container, x, y) {
  const wave = document.createElement('div');
  wave.classList.add('wave');
  
  // Random color
  const colors = [
    'rgba(90, 135, 255, 0.15)',
    'rgba(132, 83, 227, 0.15)',
    'rgba(255, 75, 75, 0.15)',
    'rgba(251, 137, 251, 0.15)',
    'rgba(61, 195, 255, 0.15)',
    'rgba(24, 255, 116, 0.15)'
  ];
  
  wave.style.background = colors[Math.floor(Math.random() * colors.length)];
  wave.style.width = '10px';
  wave.style.height = '10px';
  wave.style.left = `${x}px`;
  wave.style.top = `${y}px`;
  
  container.appendChild(wave);
  
  anime({
    targets: wave,
    width: '200px',
    height: '200px',
    left: `${x - 100}px`,
    top: `${y - 100}px`,
    opacity: [0.5, 0],
    easing: 'easeOutSine',
    duration: 1500,
    complete: function() {
      if (container.contains(wave)) {
        container.removeChild(wave);
      }
    }
  });
}

function createGeometricShapesAnimation() {
  const container = showcaseElement;
  container.className = 'example-shapes';
  
  const shapes = ['square', 'circle', 'triangle'];
  const numShapes = 15;
  
  for (let i = 0; i < numShapes; i++) {
    const shape = document.createElement('div');
    shape.classList.add('shape');
    
    // Random shape type
    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Set size and color
    const size = Math.random() * 40 + 20;
    const hue = Math.random() * 360;
    
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.backgroundColor = `hsla(${hue}, 80%, 60%, 0.8)`;
    shape.style.position = 'absolute';
    shape.style.left = `${Math.random() * 80 + 10}%`;
    shape.style.top = `${Math.random() * 80 + 10}%`;
    
    // Apply shape-specific styles
    if (shapeType === 'circle') {
      shape.style.borderRadius = '50%';
    } else if (shapeType === 'triangle') {
      shape.style.width = '0';
      shape.style.height = '0';
      shape.style.backgroundColor = 'transparent';
      shape.style.borderLeft = `${size / 2}px solid transparent`;
      shape.style.borderRight = `${size / 2}px solid transparent`;
      shape.style.borderBottom = `${size}px solid hsla(${hue}, 80%, 60%, 0.8)`;
    }
    
    container.appendChild(shape);
  }
  
  // Animate the shapes
  currentAnimation = anime({
    targets: '.shape',
    translateX: function() { return anime.random(-50, 50); },
    translateY: function() { return anime.random(-50, 50); },
    scale: function() { return anime.random(0.2, 2); },
    rotate: function() { return anime.random(0, 360); },
    borderRadius: function() { return anime.random(0, 50) + '%'; },
    duration: function() { return anime.random(1000, 3000); },
    delay: function() { return anime.random(0, 400); },
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutQuad'
  });
}

function createTimelineAnimation() {
  const container = showcaseElement;
  container.className = 'example-timeline';
  
  // Create elements for the timeline
  for (let i = 1; i <= 3; i++) {
    const element = document.createElement('div');
    element.classList.add('shape', `element-${i}`);
    
    element.style.width = '50px';
    element.style.height = '50px';
    element.style.backgroundColor = `var(--${i === 1 ? 'primary' : i === 2 ? 'secondary' : 'accent'})`;
    element.style.position = 'absolute';
    element.style.borderRadius = '4px';
    element.style.left = '30%';
    element.style.top = `${30 + (i - 1) * 25}%`;
    
    container.appendChild(element);
  }
  
  // Create timeline animation
  const timeline = anime.timeline({
    easing: 'easeOutExpo',
    duration: 750,
    loop: true
  });
  
  timeline
    .add({
      targets: '.element-1',
      translateX: 250
    })
    .add({
      targets: '.element-2',
      translateX: 250
    }, '-=600')
    .add({
      targets: '.element-3',
      translateX: 250
    }, '-=800')
    .add({
      targets: ['.element-1', '.element-2', '.element-3'],
      translateX: 0,
      delay: anime.stagger(100),
      duration: 1000,
      easing: 'easeInOutQuad'
    }, '+=500');
  
  currentAnimation = timeline;
}

function createStaggeringAnimation() {
  const container = showcaseElement;
  container.className = 'example-staggering';
  
  // Create a grid
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('example-grid');
  container.appendChild(gridContainer);
  
  // Create grid items
  const columns = 14;
  const rows = 5;
  
  for (let i = 0; i < columns * rows; i++) {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridContainer.appendChild(gridItem);
  }
  
  // Animate the grid items
  currentAnimation = anime({
    targets: '.grid-item',
    scale: [
      {value: .1, easing: 'easeOutSine', duration: 500},
      {value: 1, easing: 'easeInOutQuad', duration: 1200}
    ],
    delay: anime.stagger(200, {grid: [columns, rows], from: 'center'}),
    loop: true,
    direction: 'alternate'
  });
}

function createSvgDrawingAnimation() {
  const container = showcaseElement;
  container.className = 'example-drawing';
  
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 500 500');
  
  // Add paths
  const paths = [
    'M70,240 C70,110 350,110 350,240 C350,370 70,370 70,240 Z',
    'M200,100 Q400,150 200,400 Q0,150 200,100 Z',
    'M150,50 L350,50 L350,350 L150,350 Z'
  ];
  
  for (let i = 0; i < paths.length; i++) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', paths[i]);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', `var(--${i === 0 ? 'primary' : i === 1 ? 'secondary' : 'accent'})`);
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
  }
  
  container.appendChild(svg);
  
  // Animate the path drawing
  currentAnimation = anime({
    targets: 'path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 1500,
    delay: function(el, i) { return i * 250 },
    direction: 'alternate',
    loop: true
  });
}

function createDefaultAnimation() {
  const container = showcaseElement;
  container.className = 'example-particles';
  
  const numParticles = 50;
  
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Set random size and color
    const size = Math.random() * 8 + 3;
    const hue = Math.random() * 60 + 200; // Blue to purple range
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = `hsla(${hue}, 80%, 60%, 0.8)`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    container.appendChild(particle);
  }
  
  // Animate the particles
  currentAnimation = anime({
    targets: '.particle',
    translateX: function() { return anime.random(-100, 100); },
    translateY: function() { return anime.random(-100, 100); },
    scale: function() { return anime.random(0.2, 1.5); },
    opacity: function() { return anime.random(0.2, 0.8); },
    easing: 'easeInOutQuad',
    duration: function() { return anime.random(1200, 3000); },
    complete: function(anim) {
      // Loop the animation
      if (currentAnimation) {
        anim.restart();
      }
    }
  });
  
  // Add mouse interaction
  container.addEventListener('mousemove', handleParticleMouseMove);
}

function handleParticleMouseMove(e) {
  const container = showcaseElement;
  const rect = container.getBoundingClientRect();
  
  if (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Attract particles to mouse
    const particles = container.querySelectorAll('.particle');
    particles.forEach(particle => {
      const particleRect = particle.getBoundingClientRect();
      const particleX = particleRect.left - rect.left + particleRect.width / 2;
      const particleY = particleRect.top - rect.top + particleRect.height / 2;
      
      const dx = mouseX - particleX;
      const dy = mouseY - particleY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        anime({
          targets: particle,
          translateX: `+=${dx * 0.1}`,
          translateY: `+=${dy * 0.1}`,
          duration: 500,
          easing: 'easeOutQuad'
        });
      }
    });
  }
}

// Create a magical ideas animation that demonstrates AI transforming ideas into visuals
function createMagicalIdeasAnimation() {
  const container = showcaseElement;
  container.className = 'example-magical-ideas';
  
  // Create the idea particles
  const rows = 20;
  const cols = 20;
  const totalParticles = rows * cols;
  
  // Create particles
  for (let i = 0; i < totalParticles; i++) {
    const particle = document.createElement('div');
    particle.classList.add('idea-particle');
    
    // Set random size and color
    const size = Math.random() * 10 + 3;
    const hue = Math.floor(Math.random() * 360);
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = `hsla(${hue}, 80%, 60%, 0.8)`;
    particle.style.borderRadius = '50%';
    particle.style.position = 'absolute';
    
    // Random initial position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    container.appendChild(particle);
  }
  
  // Create floating words representing "ideas"
  const ideas = ['Animate', 'Create', 'Imagine', 'Dream', 'Visualize', 'Transform', 'Magic', 'Art', 'Motion', 'Design'];
  
  for (let i = 0; i < ideas.length; i++) {
    const idea = document.createElement('div');
    idea.classList.add('floating-idea');
    idea.textContent = ideas[i];
    
    // Random position
    idea.style.left = `${Math.random() * 80 + 10}%`;
    idea.style.top = `${Math.random() * 80 + 10}%`;
    
    // Random rotation
    idea.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
    
    // Random font size
    const fontSize = Math.random() * 20 + 14;
    idea.style.fontSize = `${fontSize}px`;
    
    // Random color
    const hue = Math.floor(Math.random() * 60 + 180);
    idea.style.color = `hsl(${hue}, 80%, 70%)`;
    
    container.appendChild(idea);
  }
  
  // Create the AI "brain" visualization at center
  const aiHub = document.createElement('div');
  aiHub.classList.add('ai-hub');
  container.appendChild(aiHub);
  
  for (let i = 0; i < 5; i++) {
    const ring = document.createElement('div');
    ring.classList.add('ai-ring');
    ring.style.width = `${(i+1) * 40}px`;
    ring.style.height = `${(i+1) * 40}px`;
    ring.style.animationDelay = `${i * 0.2}s`;
    aiHub.appendChild(ring);
  }
  
  // Animate particles
  const particles = container.querySelectorAll('.idea-particle');
  anime({
    targets: particles,
    translateX: function() { return anime.random(-150, 150); },
    translateY: function() { return anime.random(-150, 150); },
    scale: function() { return anime.random(0.2, 2.5); },
    opacity: function() { return anime.random(0.3, 0.9); },
    easing: 'easeOutElastic(1, .6)',
    duration: function() { return anime.random(2000, 4000); },
    delay: anime.stagger(10, {grid: [rows, cols], from: 'center'}),
    complete: function(anim) {
      // Create continuous morphing animation
      anime({
        targets: particles,
        translateX: function() { return anime.random(-100, 100); },
        translateY: function() { return anime.random(-100, 100); },
        scale: function() { return anime.random(0.1, 2); },
        opacity: function() { return anime.random(0.2, 1); },
        easing: 'easeInOutQuad',
        duration: function() { return anime.random(1000, 3000); },
        delay: anime.stagger(10, {grid: [rows, cols], from: 'center'}),
        direction: 'alternate',
        loop: true
      });
    }
  });
  
  // Animate floating ideas
  anime({
    targets: '.floating-idea',
    translateY: function() { return anime.random(-30, 30); },
    translateX: function() { return anime.random(-30, 30); },
    rotate: function() { return anime.random(-15, 15); },
    opacity: [0.4, 1],
    scale: [0.8, 1.2],
    duration: function() { return anime.random(3000, 5000); },
    delay: function() { return anime.random(0, 1000); },
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine'
  });
  
  // Animate AI hub
  anime({
    targets: '.ai-ring',
    scale: [0, 1],
    opacity: [1, 0],
    easing: 'easeOutSine',
    duration: 3000,
    loop: true
  });
  
  // Add mouse interaction
  container.addEventListener('mousemove', handleMagicalIdeasMouseMove);
  container.addEventListener('click', createMagicalBurst);
}

// Handle mouse movement for magical ideas animation
function handleMagicalIdeasMouseMove(e) {
  const container = showcaseElement;
  const rect = container.getBoundingClientRect();
  
  if (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Attract particles to mouse
    const particles = container.querySelectorAll('.idea-particle');
    particles.forEach((particle, i) => {
      const particleRect = particle.getBoundingClientRect();
      const particleX = particleRect.left - rect.left + particleRect.width / 2;
      const particleY = particleRect.top - rect.top + particleRect.height / 2;
      
      const dx = mouseX - particleX;
      const dy = mouseY - particleY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        // Apply force inversely proportional to distance
        const force = 150 / Math.max(50, distance);
        const moveX = dx * force;
        const moveY = dy * force;
        
        anime({
          targets: particle,
          translateX: `+=${moveX}`,
          translateY: `+=${moveY}`,
          duration: 300,
          easing: 'easeOutQuad'
        });
        
        // Adjust size based on distance
        const newSize = 5 + (150 / Math.max(50, distance) * 8);
        particle.style.width = `${newSize}px`;
        particle.style.height = `${newSize}px`;
      }
    });
    
    // Move the AI hub to follow the cursor
    const aiHub = container.querySelector('.ai-hub');
    if (aiHub) {
      anime({
        targets: aiHub,
        left: mouseX + 'px',
        top: mouseY + 'px',
        duration: 300,
        easing: 'easeOutQuad'
      });
    }
  }
}

// Create a burst of particles when clicking
function createMagicalBurst(e) {
  const container = showcaseElement;
  const rect = container.getBoundingClientRect();
  
  if (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Create new particles at click location
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('burst-particle');
      
      // Set size and color
      const size = Math.random() * 8 + 2;
      const hue = Math.floor(Math.random() * 60 + 180);
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = `hsla(${hue}, 90%, 60%, 0.9)`;
      particle.style.borderRadius = '50%';
      particle.style.position = 'absolute';
      particle.style.left = `${mouseX}px`;
      particle.style.top = `${mouseY}px`;
      
      container.appendChild(particle);
      
      // Animate the particle outward
      anime({
        targets: particle,
        translateX: () => anime.random(-200, 200),
        translateY: () => anime.random(-200, 200),
        scale: [1, 0],
        opacity: [1, 0],
        easing: 'easeOutExpo',
        duration: 1500,
        complete: function() {
          if (container.contains(particle)) {
            container.removeChild(particle);
          }
        }
      });
    }
    
    // Create a new idea at click location
    const ideas = ['Creativity', 'Imagination', 'Animation', 'Particles', 'Effects', 'Ideas', 'Motion', 'Shapes', 'Colors', 'Patterns'];
    const idea = document.createElement('div');
    idea.classList.add('floating-idea', 'new-idea');
    idea.textContent = ideas[Math.floor(Math.random() * ideas.length)];
    idea.style.left = `${mouseX}px`;
    idea.style.top = `${mouseY}px`;
    idea.style.fontSize = '24px';
    idea.style.color = '#ffffff';
    container.appendChild(idea);
    
    // Animate the new idea
    anime({
      targets: idea,
      translateY: -50,
      opacity: [1, 0],
      scale: [0, 1.5],
      easing: 'easeOutExpo',
      duration: 1500,
      complete: function() {
        if (container.contains(idea)) {
          container.removeChild(idea);
        }
      }
    });
  }
} 