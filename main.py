import os
import sys
import importlib.util

# Add backend-python to sys.path so its modules (db, analyzer, pdf_report) resolve
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend-python')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Load backend-python/main.py
target_path = os.path.join(backend_dir, 'main.py')
spec = importlib.util.spec_from_file_location('backend_main', target_path)
module = importlib.util.module_from_spec(spec)
sys.modules['backend_main'] = module
spec.loader.exec_module(module)

app = module.app
