export const codeSnippets = {
  javascript: [
    `const calculateWpm = (correctChars, seconds) => {
  if (seconds <= 0) return 0;
  const words = correctChars / 5;
  const minutes = seconds / 60;
  return Math.round(words / minutes);
};`,
    `const fetchUserData = async (userId) => {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error('Failed');
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
  }
};`,
    `useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);`
  ],
  python: [
    `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`,
    `class TreeNode:
    def __init__(self, value=0, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

    def is_leaf(self):
        return self.left is None and self.right is None`
  ],
  css: [
    `.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  background-color: var(--bg-surface);
}`,
    `.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
}`
  ],
  html: [
    `<div className="container">
  <header className="header">
    <h1>Welcome to Typing Club</h1>
    <button className="btn-primary">Start Practice</button>
  </header>
</div>`,
    `<form onSubmit={handleSubmit}>
  <label htmlFor="email">Email Address</label>
  <input id="email" type="email" required />
  <button type="submit">Subscribe</button>
</form>`
  ],
  cpp: [
    `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    for (int num : numbers) {
        std::cout << num << " ";
    }
    return 0;
}`,
    `template <typename T>
class Stack {
private:
    std::vector<T> elements;
public:
    void push(T const& elem) {
        elements.push_back(elem);
    }
};`
  ]
};
