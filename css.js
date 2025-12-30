/* Adicione ou substitua no seu <style> */
.exercise-card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.exercise-card:focus-within {
    border-color: #ffd93d;
    box-shadow: 0 0 10px rgba(255, 217, 61, 0.3);
}

.history-item:first-child {
    border-left: 4px solid #a3d977; /* Destaca o registro mais recente */
    background: #e8f5e9;
}
