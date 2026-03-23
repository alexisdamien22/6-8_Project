<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>Six-Huit | Apprentissage Musical</title>
    
    <link rel="stylesheet" href="public/assets/css/style.css">
</head>
<body>

    <?php 
        $headerPath = __DIR__ . '/src/view/header.php';
        if (file_exists($headerPath)) {
            include $headerPath;
        } else {
            echo "";
        }
    ?>

    <div id="app">
        </div>

    <script src="src/model/AppModel.js"></script>
    <script src="src/view/AppView.js"></script>
    <script src="src/controller/AppController.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            try {
                if (typeof AppModel !== 'undefined' && typeof AppView !== 'undefined' && typeof AppController !== 'undefined') {
                    const model = new AppModel();
                    const view = new AppView();
                    const app = new AppController(model, view);
                    console.log("Système Six-Huit initialisé avec succès.");
                } else {
                    console.error("Erreur : Une ou plusieurs classes MVC sont manquantes.");
                }
            } catch (error) {
                console.error("Erreur lors du lancement de l'application :", error);
            }
        });
    </script>
</body>
</html>