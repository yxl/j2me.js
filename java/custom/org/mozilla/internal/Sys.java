/*
 *
 *
 * Copyright  1990-2007 Sun Microsystems, Inc. All Rights Reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License version
 * 2 only, as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License version 2 for more details (a copy is
 * included at /legal/license.txt).
 *
 * You should have received a copy of the GNU General Public License
 * version 2 along with this work; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA
 *
 * Please contact Sun Microsystems, Inc., 4150 Network Circle, Santa
 * Clara, CA 95054 or visit www.sun.com if you need additional
 * information or have any questions.
 */

package org.mozilla.internal;

import java.io.*;
import com.sun.cldchi.io.*;
import java.security.*;
import java.util.PropertyPermission;

/**
 * The <code>Sys</code> class contains several useful privileged functions.
 */
public final class Sys {
  private Sys() { }

  public static void copyArray(byte [] src, int srcOffset,
                               byte [] dst, int dstOffset,
                               int length) {
    if (src == dst) {
      System.arraycopy(src, srcOffset, dst, dstOffset, length);
      return;
    }

    if (srcOffset < 0 || (srcOffset + length) > src.length || dstOffset < 0 || (dstOffset + length) > dst.length || length < 0) {
      throw new ArrayIndexOutOfBoundsException("Invalid index.");
    }

    for (int n = 0; n < length; ++n) {
      dst[dstOffset++] = src[srcOffset++];
    }
  }

  public static void copyArray(char [] src, int srcOffset,
                               char [] dst, int dstOffset,
                               int length) {
    if (src == dst) {
      System.arraycopy(src, srcOffset, dst, dstOffset, length);
      return;
    }

    if (srcOffset < 0 || (srcOffset + length) > src.length || dstOffset < 0 || (dstOffset + length) > dst.length || length < 0) {
      throw new ArrayIndexOutOfBoundsException("Invalid index.");
    }

    for (int n = 0; n < length; ++n) {
      dst[dstOffset++] = src[srcOffset++];
    }
  }

  /**
   * Evals code in the JS shell, only available in non-release builds as an
   * escape hatch for the purpose of testing and profiling.
   */
  public native static void eval(String src);

  public static void throwException(Exception e) throws Exception {
    throw e;
  }

  public static void runThread(Thread t) {
    t.run();
    synchronized (t) {
      t.notifyAll();
    }
  }
}
