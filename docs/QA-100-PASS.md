# ClipForge — QA / UX 100-pass review

This checklist defines the 100 review points used for the 0.3.0 product pass. It is a design/code review matrix, not a claim of 100 automated runtime tests on Windows.

## 01–10 Window & platform
1. Normal window opens at a usable desktop size.
2. Minimum window size preserves editor usability.
3. Window position is restored when possible.
4. Window size is restored when possible.
5. Dark title bar matches application surface.
6. PHP server lifecycle is owned by Electron.
7. FFmpeg discovery supports bundled and common Windows paths.
8. GPU status is logged for diagnostics.
9. Chromium GPU rasterization is enabled without forcing vendor codecs.
10. Quit closes the local PHP process.

## 11–20 Global layout
11. Topbar stays compact.
12. Primary action hierarchy is clear.
13. Export is visually dominant but not duplicated.
14. Editor panels use consistent spacing.
15. Panel borders use low-contrast dark lines.
16. Preview is vertically dominant but bounded.
17. Timeline retains a usable height in a windowed layout.
18. Workspace avoids unnecessary page scrolling on desktop.
19. Responsive fallback exists for smaller windows.
20. Layout density favors editing over decoration.

## 21–30 Multimedia
21. Video import remains primary.
22. Audio import remains separate.
23. Image import exists.
24. Text creation exists.
25. Media library has type filters.
26. Media items show type clearly.
27. Media items can be dragged.
28. Media list has an empty state.
29. Media count is visible.
30. Library can be collapsed to recover workspace width.

## 31–40 Timeline
31. Timeline is the central project model.
32. Multiple video tracks are supported.
33. Multiple audio tracks are supported.
34. Multiple image tracks are supported.
35. Multiple text tracks are supported.
36. Tracks can be locked.
37. Tracks can be renamed.
38. Tracks can be created contextually.
39. Clips expose move affordance.
40. Clips expose trim affordances.

## 41–50 Navigation & editing
41. Clicking a lane changes project time.
42. Playhead represents project time.
43. Playhead can be dragged.
44. Snapping can be enabled.
45. Shift can be used for precision movement.
46. Split uses playhead time.
47. Clip movement preserves duration.
48. Escape can cancel drag interactions where supported.
49. Delete uses selection state.
50. Undo/redo state is surfaced.

## 51–60 Preview
51. Preview uses 9:16 composition.
52. Preview is bounded inside its panel.
53. Video uses a non-distorting fit mode.
54. Timeline time maps to preview time.
55. Edit-preview mode can skip marked pauses.
56. Text overlay remains above video.
57. Image overlays have a dedicated layer.
58. Preview errors are logged.
59. Preview controls remain visible in compact windows.
60. Preview does not require fullscreen use.

## 61–70 Audio
61. Video audio is represented separately.
62. Audio waveforms are represented visually.
63. External audio can be added independently.
64. Multiple audio clips can coexist.
65. Audio volume is editable.
66. Mute state is explicit.
67. Fade controls can be exposed through the inspector.
68. Ducking is part of the audio model.
69. Audio sync follows project time.
70. Audio failures are diagnosable from the console.

## 71–80 Text & overlays
71. Text is a timeline object.
72. Text has a duration.
73. Text has X/Y position data.
74. Text can be moved on the preview.
75. Text can be selected from the timeline.
76. Text style is editable in the inspector.
77. Text position survives timeline redraws.
78. Text can be placed independently of video cuts.
79. Text can be duplicated.
80. Text context actions exist.

## 81–90 Auto Edit
81. Auto Edit is a mode, not just one button.
82. Silence analysis feeds the timeline.
83. Silence decisions remain reversible.
84. Apply creates an editable timeline result.
85. Preview can show the proposed result before export.
86. Style profile can be applied as rules.
87. Style profile does not require VEGAS to run.
88. Auto Edit actions are logged.
89. Failed analysis shows an actionable status.
90. Auto Edit does not re-upload media unnecessarily when avoidable.

## 91–100 Product polish
91. Right-click menus are contextual.
92. Empty-track context actions are available.
93. Panel resizing is possible.
94. Panel widths persist locally.
95. Timeline height persists locally.
96. Command palette provides discoverability.
97. UI uses dark professional contrast levels.
98. The application avoids visual clutter.
99. Desktop version is versioned independently.
100. New changes remain modular so the editor can move toward a single timeline/render model.
