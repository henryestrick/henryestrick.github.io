/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #0046a8;
    --secondary-color: #da291c;
    --accent-color: #ffc72c;
    --light-gray: #f5f7fa;
    --medium-gray: #e1e5eb;
    --dark-gray: #333;
    --text-color: #2d3748;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    --border-radius: 8px;
    --transition: all 0.3s ease;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: #f9fafb;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header Styles */
header {
    background: linear-gradient(135deg, var(--primary-color), #003080);
    color: white;
    padding: 2rem 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
}

header::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--secondary-color), var(--accent-color));
}

.brand h1 {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand h1 i {
    color: var(--accent-color);
    font-size: 2.5rem;
}

.brand p {
    font-size: 1.1rem;
    opacity: 0.9;
    font-weight: 300;
}

/* Main Content */
main {
    flex: 1;
    padding: 2rem 0 4rem;
}

/* Controls Section */
.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
    gap: 1.5rem;
}

.toggle-group {
    display: flex;
    background-color: var(--light-gray);
    border-radius: var(--border-radius);
    padding: 4px;
    box-shadow: var(--shadow);
}

.toggle-group button {
    padding: 12px 24px;
    border: none;
    background: transparent;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: var(--transition);
    color: var(--dark-gray);
}

.toggle-group button.active {
    background-color: white;
    color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toggle-group button:hover:not(.active) {
    background-color: rgba(255, 255, 255, 0.7);
}

.action-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: var(--border-radius);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: var(--transition);
    box-shadow: var(--shadow);
}

.action-btn:hover {
    background-color: #003080;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 70, 168, 0.25);
}

.action-btn i {
    font-size: 1.1rem;
}

/* Search Container */
.search-container {
    margin-bottom: 2.5rem;
}

.search-box {
    position: relative;
    max-width: 600px;
}

.search-box i {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--primary-color);
    font-size: 1.2rem;
}

.search-box input {
    width: 100%;
    padding: 18px 20px 18px 52px;
    border: 2px solid var(--medium-gray);
    border-radius: var(--border-radius);
    font-size: 1.1rem;
    transition: var(--transition);
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-box input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(0, 70, 168, 0.15);
}

/* Items Grid */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.item-card {
    background-color: white;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    height: 100%;
}

.item-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.item-image {
    height: 200px;
    background-color: var(--light-gray);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
}

.item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.default-image {
    font-size: 4rem;
    color: var(--medium-gray);
}

.item-content {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.item-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-right: 10px;
}

.item-type {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

.type-found {
    background-color: rgba(0, 150, 0, 0.1);
    color: #006600;
}

.type-lost {
    background-color: rgba(218, 41, 28, 0.1);
    color: var(--secondary-color);
}

.item-details {
    margin-bottom: 1.5rem;
    flex: 1;
}

.detail-row {
    display: flex;
    margin-bottom: 0.75rem;
    align-items: flex-start;
}

.detail-row i {
    width: 24px;
    color: var(--primary-color);
    margin-right: 10px;
    margin-top: 2px;
    text-align: center;
}

.detail-row span {
    flex: 1;
}

.item-date {
    font-size: 0.9rem;
    color: #666;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid var(--medium-gray);
    display: flex;
    align-items: center;
}

.item-date i {
    margin-right: 8px;
    color: #666;
}

/* Loading State */
.loading {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 0;
}

.loading i {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
}

.loading p {
    font-size: 1.2rem;
    color: var(--dark-gray);
}

/* Empty State */
.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 0;
    color: #666;
}

.empty-state i {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    color: var(--medium-gray);
}

.empty-state h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--dark-gray);
}

/* Footer */
footer {
    background-color: var(--dark-gray);
    color: white;
    padding: 2.5rem 0;
    text-align: center;
    margin-top: auto;
}

footer p {
    opacity: 0.8;
    line-height: 1.8;
}

/* Responsive Styles */
@media (max-width: 768px) {
    .controls {
        flex-direction: column;
        align-items: stretch;
    }
    
    .toggle-group {
        align-self: center;
    }
    
    .brand h1 {
        font-size: 1.8rem;
    }
    
    .grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }
    
    .item-content {
        padding: 1.25rem;
    }
}

@media (max-width: 480px) {
    .brand h1 {
        font-size: 1.5rem;
    }
    
    .brand p {
        font-size: 1rem;
    }
    
    .toggle-group {
        width: 100%;
    }
    
    .toggle-group button {
        flex: 1;
        padding: 10px 16px;
    }
    
    .grid {
        grid-template-columns: 1fr;
    }
}
