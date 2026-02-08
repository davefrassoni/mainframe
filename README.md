# IBM z/OS TSO Simulator

A web-based emulator of an IBM Mainframe running z/OS TSO/E, built with React.

## Features
- **z/OS Look & Feel**: IPL boot sequence, 3270-style fonts, scanlines, and green phosphor glow.
- **TSO/E Commands**: Implementation of common Time Sharing Option commands.
- **ISPF Editor**: Integrated full-screen editor for modifying datasets.
- **Persistence**: All "Datasets" and session history are saved to local browser storage.

## Supported Commands

| Command | Alias | Description |
| :--- | :--- | :--- |
| `LISTCAT` | `LISTC`, `LC` | List cataloged datasets (files) in current prefix. |
| `EDIT` | `E`, `OEDIT` | Open the full-screen ISPF-style editor. |
| `ALLOCATE` | `ALLOC` | Create a new dataset (file). Use with `DSORG(PO)` to create a PDS (directory). |
| `DELETE` | `DEL` | Delete a dataset or member. |
| `SUBMIT` | `SUB` | Submit a JCL job (Simulation). |
| `TIME` | `T` | Display system time and date. |
| `LOGOFF` | `EXIT` | End session and "restart" the terminal. |
| `HELP` | | Show command list. |

## File System (Datasets)
The simulator maps the concept of z/OS Datasets to a virtual file system. 
- **Sequential Datasets** are regular files.
- **Partitioned Datasets (PDS)** are treated as directories containing members.
- Navigation via `CD` is supported to change your "Current Prefix".

## Getting Started
1. `npm install`
2. `npm run dev`
