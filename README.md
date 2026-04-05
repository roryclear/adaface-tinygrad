tinygrad implementation of: AdaFace (adaface_ir50_ms1mv2)
![webgpu page](sample.jpg)

## Setup:
```
pip install -r requirements.txt
```

## Inference on single image:
```
python test.py
```

## Live WebGPU inference
```
python compile_to_webgpu.py
python -m http.server 8080
```
open localhost:8080

## Testing performance
```
PYTHONPATH=. python test/test_jit.py
```
### for faster inference use tinygrad's BEAM search:
```
PYTHONPATH=. BEAM=2 python test_jit.py
```
this will result in a longer initial run time as the searches are performed and cached. For visibility on the process use:
```
PYTHONPATH=. BEAM=2 DEBUG=2 python test_jit.py
```
