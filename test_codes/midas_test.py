import cv2
import torch
import matplotlib.pyplot as plt

# DOWNLOAD MiDas
midas = torch.hub.load('intel-isl/MiDas', 'MiDaS_small', trust_repo=True)  # Corrected capitalization
midas.to('cpu')
midas.eval()

# INPUT TRANSFORMATIONAL PIPELINE
transforms = torch.hub.load('intel-isl/MiDas', 'transforms')
transform = transforms.small_transform

# INTO OPEN CV
cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        cv2.waitKey(1)
        continue

    # TRANSFORM INPUT FOR MiDas
    img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    imgbatch = transform(img).to('cpu')

    # MAKE A PREDICTION
    with torch.no_grad():
        prediction = midas(imgbatch)
        prediction = torch.nn.functional.interpolate(
            prediction.unsqueeze(1),
            size = img.shape[:2],
            mode = 'bicubic',
            align_corners = False
        ).squeeze()

        output = prediction.cpu().numpy()
        # print(output)

    plt.imshow(output)
    cv2.imshow('FRAME', frame)
    plt.pause(0.00000001)

    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()