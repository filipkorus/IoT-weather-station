| Frame Header | Src MAC | Target MAC | Length of Command | Command |
|---|---|---|---| --- |
| 0xFE 0xFF | 6 bytes of MAC | 6 bytes of MAC | XX | XX |

Length of frame:

2 + 6 + 6 + XX

## Commands

### Send ACK

| Length of Command | Command | Value |
| ----------------- | ------- | ----- |
| 0x1               | 0x0     | N/A  |

### Send pairing request
Target MAC: `FF:FF:FF:FF:FF:FF`

| Length of Command | Command | Value |
| ----------------- | ------- | ----- |
| 0x1               | 0x1     | N/A |

